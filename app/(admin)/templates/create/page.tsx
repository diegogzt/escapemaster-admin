"use client";

import React, { useState } from "react";
import { createTemplate } from "@/services/templates";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CreateTemplatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    layout: "[]",
    is_default: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createTemplate({
        ...formData,
        layout: JSON.parse(formData.layout),
      });
      router.push("/templates");
    } catch {
      alert("Error al crear plantilla");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/templates" className="inline-flex items-center text-[#1F6357] hover:text-[#164a41] mb-6">
        <ArrowLeft size={20} className="mr-2" />
        Volver a plantillas
      </Link>

      <h1 className="text-3xl font-bold text-[#1F6357] mb-8">Crear Plantilla</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl border border-gray-200">
        <Input label="Nombre" name="name" value={formData.name} onChange={handleChange} required placeholder="Ej: Hotel Manager Default" />
        <Input label="Descripción" name="description" value={formData.description} onChange={handleChange} placeholder="Descripción breve de la plantilla" />

        <div className="flex items-center gap-2 mb-6">
          <input
            type="checkbox"
            id="is_default"
            name="is_default"
            checked={formData.is_default}
            onChange={handleChange}
            className="w-5 h-5 text-[#1F6357] border-2 border-gray-300 rounded focus:ring-[#1F6357]"
          />
          <label htmlFor="is_default" className="font-semibold text-gray-800">
            Marcar como plantilla por defecto
          </label>
        </div>

        <div className="mb-6">
          <label htmlFor="layout" className="block mb-2 font-semibold text-gray-800">
            Configuración de Layout (JSON)
          </label>
          <p className="text-sm text-gray-500 mb-2">
            Define el grid layout y los widgets.
          </p>
          <textarea
            id="layout"
            name="layout"
            value={formData.layout}
            onChange={(e) => setFormData({ ...formData, layout: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-base focus:border-[#1F6357] focus:ring-1 focus:ring-[#1F6357] h-64 font-mono outline-none"
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" loading={loading} className="bg-[#1F6357] hover:bg-[#164a41] text-white">
            Crear Plantilla
          </Button>
        </div>
      </form>
    </div>
  );
}
