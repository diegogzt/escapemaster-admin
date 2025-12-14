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
    } catch (error) {
      console.error("Failed to load widgets", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this widget?")) {
      await deleteWidget(id);
      loadWidgets();
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-dark">Widget Registry</h1>
        <Link href="/widgets/create">
          <Button>Create Widget</Button>
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {widgets.map((widget) => (
            <Card key={widget.id} className="w-full max-w-none">
              <CardHeader>
                <CardTitle>{widget.name}</CardTitle>
                <p className="text-sm text-gray-500">{widget.slug}</p>
              </CardHeader>
              <div className="mb-4">
                <p className="text-dark">
                  {widget.description || "No description"}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Component:{" "}
                  <code className="bg-gray-100 px-1 rounded">
                    {widget.component_path}
                  </code>
                </p>
              </div>
              <CardFooter className="flex justify-end gap-2">
                <Link href={`/widgets/${widget.id}`}>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(widget.id)}
                  className="text-red-600 hover:bg-red-50"
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
