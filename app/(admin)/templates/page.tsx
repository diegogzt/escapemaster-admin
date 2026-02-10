"use client";

import React, { useEffect, useState } from "react";
import { getTemplates, DashboardTemplate, deleteTemplate } from "@/services/templates";
import Button from "@/components/Button";
import Card, { CardHeader, CardTitle, CardFooter } from "@/components/Card";
import Link from "next/link";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<DashboardTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const data = await getTemplates();
      setTemplates(data);
    } catch {
      // handled by empty state
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta plantilla?")) return;
    await deleteTemplate(id);
    loadTemplates();
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#1F6357]">Plantillas de Dashboard</h1>
        <Link href="/templates/create">
          <Button className="bg-[#1F6357] hover:bg-[#164a41] text-white">Crear Plantilla</Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F6357]" />
        </div>
      ) : templates.length === 0 ? (
        <Card className="text-center py-16">
          <h3 className="text-xl font-semibold text-gray-700">Sin plantillas</h3>
          <p className="text-gray-500 mt-2">Crea tu primera plantilla de dashboard</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="w-full max-w-none">
              <CardHeader>
                <CardTitle>{template.name}</CardTitle>
                {template.is_default && (
                  <span className="bg-[#1F6357] text-white text-xs px-2 py-1 rounded-full ml-2">
                    Por defecto
                  </span>
                )}
              </CardHeader>
              <div className="mb-4">
                <p className="text-gray-700">{template.description || "Sin descripción"}</p>
                <p className="text-sm text-gray-500 mt-2">Widgets: {template.layout.length}</p>
              </div>
              <CardFooter className="flex justify-end gap-2">
                <Link href={`/templates/${template.id}`}>
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(template.id)}
                  className="text-red-600 hover:bg-red-50"
                >
                  Eliminar
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
