"use client";

import React, { useEffect, useState } from "react";
import { getWidgets, WidgetDefinition, deleteWidget } from "@/services/widgets";
import Button from "@/components/Button";
import Card, { CardHeader, CardTitle, CardFooter } from "@/components/Card";
import Link from "next/link";

export default function WidgetsPage() {
  const [widgets, setWidgets] = useState<WidgetDefinition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWidgets();
  }, []);

  const loadWidgets = async () => {
    try {
      const data = await getWidgets();
      setWidgets(data);
    } catch {
      // handled by empty state
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este widget?")) return;
    await deleteWidget(id);
    loadWidgets();
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#1F6357]">Registro de Widgets</h1>
        <Link href="/widgets/create">
          <Button className="bg-[#1F6357] hover:bg-[#164a41] text-white">Crear Widget</Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F6357]" />
        </div>
      ) : widgets.length === 0 ? (
        <Card className="text-center py-16">
          <h3 className="text-xl font-semibold text-gray-700">Sin widgets</h3>
          <p className="text-gray-500 mt-2">Crea tu primer widget personalizado</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {widgets.map((widget) => (
            <Card key={widget.id} className="w-full max-w-none">
              <CardHeader>
                <CardTitle>{widget.name}</CardTitle>
                <p className="text-sm text-gray-500">{widget.slug}</p>
              </CardHeader>
              <div className="mb-4">
                <p className="text-gray-700">{widget.description || "Sin descripción"}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Componente:{" "}
                  <code className="bg-gray-100 px-1 rounded">{widget.component_path}</code>
                </p>
              </div>
              <CardFooter className="flex justify-end gap-2">
                <Link href={`/widgets/${widget.id}`}>
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(widget.id)}
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
