"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/Card";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { admin } from "@/services/api";
import Link from "next/link";
import { LayoutDashboard, Building2, LogOut, ArrowLeft } from "lucide-react";

export default function CreateOrgPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { setTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bookingManager, setBookingManager] = useState("internal");

  React.useEffect(() => {
    setTheme("tropical");
  }, [setTheme]);

  React.useEffect(() => {
    const adminToken = localStorage.getItem("admin_token");
    if (!adminToken) {
      router.push("/login");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name");
    const description = formData.get("description");
    const booking_manager = formData.get("booking_manager");
    const erd_url = formData.get("erd_url");

    try {
      await admin.createOrganization({ 
        name, 
        description,
        booking_manager,
        erd_url
      });
      router.push("/organizations");
    } catch (err: any) {
      console.error("Error creating organization:", err);
      setError(err.response?.data?.detail || "Error al crear organización");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#E8F5F3]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1F6357] text-white flex flex-col fixed h-full">
        <div className="p-6 border-b border-[#2A7A6B]">
          <h1 className="text-2xl font-bold">EM Admin</h1>
          <p className="text-sm opacity-75">EscapeMaster Admin</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard">
            <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${pathname === "/dashboard" ? "bg-[#2A7A6B]" : "hover:bg-[#2A7A6B]/50"}`}>
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </div>
          </Link>
          <Link href="/organizations">
            <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${pathname.includes("/organizations") ? "bg-[#2A7A6B]" : "hover:bg-[#2A7A6B]/50"}`}>
              <Building2 size={20} />
              <span>Organizaciones</span>
            </div>
          </Link>
        </nav>

        <div className="p-4 border-t border-[#2A7A6B]">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg hover:bg-[#2A7A6B]/50 text-red-200 hover:text-red-100 transition-colors"
          >
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <Link href="/organizations" className="inline-flex items-center text-[#1F6357] hover:text-[#164a41] mb-6">
          <ArrowLeft size={20} className="mr-2" />
          Volver a organizaciones
        </Link>

        <h1 className="text-3xl font-bold text-[#1F6357] mb-2">Crear Organización</h1>
        <p className="text-gray-700 mb-8">Crea una nueva organización en el sistema</p>

        <Card className="max-w-2xl">
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
              <Input
                name="name"
                label="Nombre de la Organización"
                type="text"
                placeholder="Ej: Escape Room Madrid"
                required
              />
              <Input
                name="description"
                label="Descripción (opcional)"
                type="text"
                placeholder="Descripción de la organización"
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Gestor de Reservas</label>
                <select 
                  name="booking_manager"
                  value={bookingManager}
                  onChange={(e) => setBookingManager(e.target.value)}
                  className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F6357]"
                >
                  <option value="internal">Interno (EscapeMaster)</option>
                  <option value="er_director">ER Director</option>
                </select>
              </div>
              {bookingManager === 'er_director' && (
                <Input
                  name="erd_url"
                  label="URL del sitio web de ER Director"
                  type="url"
                  placeholder="https://www.residentriddle.es/"
                  required
                />
              )}
            </div>

            {error && <p className="text-red-500 text-sm text-center px-6">{error}</p>}

            <CardFooter className="px-6 pb-6 pt-4 flex gap-4">
              <Link href="/organizations" className="flex-1">
                <Button type="button" className="w-full bg-gray-500 hover:bg-gray-600">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" loading={loading} className="flex-1 bg-[#1F6357] hover:bg-[#164a41]">
                Crear Organización
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
}
