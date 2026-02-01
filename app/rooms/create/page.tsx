"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { admin } from "@/services/api";
import { Card } from "@/components/Card";
import { Sidebar } from "@/components/Sidebar";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Link from "next/link";
import { ArrowLeft, Save, Building2, Code } from "lucide-react";

export default function CreateRoomPage() {
  const router = useRouter();
  const { setTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [orgs, setOrgs] = useState<any[]>([]);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    capacity: 6,
    capacity_min: 2,
    duration_minutes: 60,
    price_per_person: 15,
    organization_id: "",
    is_active: true,
    verification_status: "unverified", // unverified, verified, managed
    external_details: JSON.stringify({
        "address": "Travesía de Meicende, 190, Bajo D, 15140",
        "always_available": 0,
        "birthday_pack": 0,
        "community": "Galicia",
        "description": "<p>Descripción del juego...</p>",
        "difficulty": "3",
        "duration": "60 min",
        "email": "info@example.com",
        "google_rating": "4.9",
        "latitude": "43.3472412",
        "longitude": "-8.4478623",
        "locality": "Meicende",
        "max_people": 25,
        "min_age_accompanied": "13",
        "min_age_alone": "18",
        "min_people": 6,
        "name": "Nombre Juego",
        "phone": "600000000",
        "price_eur": "15",
        "slogan": "Slogan del juego",
        "tripadvisor_rating": "5.0",
        "with_actors": 1,
        "with_fathers": 1,
        "with_monitor": 0,
        "themes": [],
        "locations": []
    }, null, 2)
  });

  const [jsonError, setJsonError] = useState<string | null>(null);

  useEffect(() => {
    setTheme("tropical");
    
    // Fetch organizations
    admin.getOrganizations()
        .then(setOrgs)
        .catch(console.error);
  }, [setTheme]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
        setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, external_details: value }));
    try {
        JSON.parse(value);
        setJsonError(null);
    } catch (err) {
        setJsonError("JSON inválido");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (jsonError) return;
    
    setLoading(true);
    try {
        const payload = {
            ...formData,
            organization_id: formData.organization_id || null, // Handle detached
            external_details: JSON.parse(formData.external_details),
            // Parse numbers
            capacity: Number(formData.capacity),
            capacity_min: Number(formData.capacity_min),
            duration_minutes: Number(formData.duration_minutes),
            price_per_person: Number(formData.price_per_person)
        };

        await admin.createRoom(payload);
        router.push("/rooms");
    } catch (error) {
        console.error("Error creating room:", error);
        alert("Error al crear la sala. Revisa la consola para más detalles.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#E8F5F3]">
      <Sidebar />

      <main className="flex-1 ml-64 p-8">
        <div className="flex items-center mb-8 gap-4">
            <Link href="/rooms" className="text-[#1F6357] hover:bg-[#1F6357]/10 p-2 rounded-full transition-colors">
                <ArrowLeft size={24} />
            </Link>
            <div>
                <h1 className="text-3xl font-bold text-[#1F6357]">Nueva Sala</h1>
                <p className="text-[#2A7A6B]/80 mt-1">Registrar un nuevo escape room</p>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
            <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Building2 size={20} className="text-[#1F6357]" />
                    Información General
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                            <Input name="name" value={formData.name} onChange={handleChange} required placeholder="Ej: El Rescate" />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad Mín</label>
                                <Input type="number" name="capacity_min" value={formData.capacity_min} onChange={handleChange} required min="1" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad Máx</label>
                                <Input type="number" name="capacity" value={formData.capacity} onChange={handleChange} required min="1" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Duración (min)</label>
                                <Input type="number" name="duration_minutes" value={formData.duration_minutes} onChange={handleChange} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Precio (€/persona)</label>
                                <Input type="number" name="price_per_person" value={formData.price_per_person} onChange={handleChange} required step="0.01" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción Corta</label>
                            <textarea 
                                name="description" 
                                value={formData.description} 
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-[#1F6357] focus:border-transparent outline-none h-32"
                                placeholder="Breve descripción..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Organización (Propietario)</label>
                            <select 
                                name="organization_id" 
                                value={formData.organization_id} 
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-[#1F6357] focus:border-transparent outline-none bg-white"
                            >
                                <option value="">-- Sin asignar (Marketplace Only) --</option>
                                {orgs.map(org => (
                                    <option key={org.id} value={org.id}>{org.name}</option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-500 mt-1">Si no seleccionas una organización, el juego será 'unverified' o 'standalone'.</p>
                        </div>
                    </div>
                </div>
            </Card>

            <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <CheckCircleIcon status={formData.verification_status} />
                    Estado y Verificación
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Estado de Verificación</label>
                        <select 
                            name="verification_status" 
                            value={formData.verification_status} 
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-[#1F6357] focus:border-transparent outline-none bg-white"
                        >
                            <option value="unverified">Unverified (Sin verificar)</option>
                            <option value="verified">Verified (Verificado)</option>
                            <option value="managed">Managed (Gestionado por EM)</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-4 pt-6">
                        <label className="flex items-center cursor-pointer gap-2">
                             <input 
                                type="checkbox" 
                                name="is_active" 
                                checked={formData.is_active} 
                                onChange={handleChange}
                                className="w-5 h-5 text-[#1F6357] rounded focus:ring-[#1F6357]" 
                             />
                             <span className="text-gray-700 font-medium">Activo en Marketplace</span>
                        </label>
                    </div>
                </div>
            </Card>

            <Card className="p-6 border-t-4 border-[#1F6357]">
                <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <Code size={20} className="text-[#1F6357]" />
                    Datos Extendidos (JSON)
                </h2>
                <p className="text-xs text-gray-500 mb-4">Pega aquí el JSON completo del scraper. Estos datos se usarán para la ficha detallada.</p>
                
                <div className="relative">
                    <textarea 
                        name="external_details"
                        value={formData.external_details}
                        onChange={handleJsonChange}
                        className={`w-full font-mono text-xs h-96 rounded-lg border p-4 focus:ring-2 outline-none ${jsonError ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-[#1F6357]'}`}
                    />
                    {jsonError && (
                        <div className="absolute bottom-4 right-4 bg-red-100 text-red-600 px-3 py-1 rounded-md text-xs font-bold shadow-sm">
                            {jsonError}
                        </div>
                    )}
                </div>
            </Card>

            <div className="flex justify-end pt-4 pb-12">
                <Button type="submit" disabled={loading || !!jsonError} className="bg-[#1F6357] hover:bg-[#164a41] text-white px-8 py-3 h-12 text-lg">
                    {loading ? "Guardando..." : "Crear Sala"}
                </Button>
            </div>
        </form>
      </main>
    </div>
  );
}

function CheckCircleIcon({ status }: { status: string }) {
    if (status === 'verified') return <div className="w-5 h-5 rounded-full bg-blue-500"></div>;
    if (status === 'managed') return <div className="w-5 h-5 rounded-full bg-purple-500"></div>;
    return <div className="w-5 h-5 rounded-full bg-gray-300"></div>;
}
