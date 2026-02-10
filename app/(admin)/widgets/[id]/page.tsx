"use client";

import React, { useEffect, useState } from "react";
import { getWidget, updateWidget } from "@/services/widgets";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function EditWidgetPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    component_path: "",
    default_config: "{}",
  });

  useEffect(() => {
    loadWidget();
  }, [id]);

  const loadWidget = async () => {
    try {
      const widget = await getWidget(id);
      if (widget) {
        setFormData({
          name: widget.name,
          slug: widget.slug,
          description: widget.description || "",
          component_path: widget.component_path,
          default_config: JSON.stringify(widget.default_config || {}, null, 2),
        });
      }
    } catch {
      // handled — form stays empty
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateWidget(id, {
        ...formData,
        default_config: JSON.parse(formData.default_config),
      });
      router.push("/widgets");
    } catch {
      alert("Error al actualizar widget");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F6357]" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/widgets" className="inline-flex items-center text-[#1F6357] hover:text-[#164a41] mb-6">
        <ArrowLeft size={20} className="mr-2" />
        Volver a widgets
      </Link>

      <h1 className="text-3xl font-bold text-[#1F6357] mb-8">Editar Widget</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl border border-gray-200">
        <Input label="Nombre" name="name" value={formData.name} onChange={handleChange} required />
        <Input label="Slug" name="slug" value={formData.slug} onChange={handleChange} required />
        <Input label="Descripción" name="description" value={formData.description} onChange={handleChange} />
        <Input label="Ruta del Componente" name="component_path" value={formData.component_path} onChange={handleChange} required />

        <div className="mb-6">
          <label htmlFor="default_config" className="block mb-2 font-semibold text-gray-800">
            Configuración por defecto (JSON)
          </label>
          <textarea
            id="default_config"
            name="default_config"
            value={formData.default_config}
            onChange={(e) => setFormData({ ...formData, default_config: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-base focus:border-[#1F6357] focus:ring-1 focus:ring-[#1F6357] h-32 font-mono outline-none"
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" loading={saving} className="bg-[#1F6357] hover:bg-[#164a41] text-white">
            Guardar Cambios
          </Button>
        </div>
      </form>
    </div>
  );
}
