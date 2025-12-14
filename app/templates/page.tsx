"use client";

import React, { useEffect, useState } from "react";
import {
  getTemplates,
  DashboardTemplate,
  deleteTemplate,
} from "@/services/templates";
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
    } catch (error) {
      console.error("Failed to load templates", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      await deleteTemplate(id);
      loadTemplates();
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-dark">Dashboard Templates</h1>
        <Link href="/templates/create">
          <Button>Create Template</Button>
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="w-full max-w-none">
              <CardHeader>
                <CardTitle>{template.name}</CardTitle>
                {template.is_default && (
                  <span className="bg-primary text-white text-xs px-2 py-1 rounded-full ml-2">
                    Default
                  </span>
                )}
              </CardHeader>
              <div className="mb-4">
                <p className="text-dark">
                  {template.description || "No description"}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Widgets: {template.layout.length}
                </p>
              </div>
              <CardFooter className="flex justify-end gap-2">
                <Link href={`/templates/${template.id}`}>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(template.id)}
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
