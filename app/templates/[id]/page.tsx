"use client";

import React, { useEffect, useState } from "react";
import {
  getTemplate,
  updateTemplate,
  DashboardTemplate,
} from "@/services/templates";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useRouter, useParams } from "next/navigation";

export default function EditTemplatePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    layout: "[]",
    is_default: false,
  });

  useEffect(() => {
    loadTemplate();
  }, [id]);

  const loadTemplate = async () => {
    try {
      const template = await getTemplate(id);
      if (template) {
        setFormData({
          name: template.name,
          description: template.description || "",
          layout: JSON.stringify(template.layout, null, 2),
          is_default: template.is_default,
        });
      }
    } catch (error) {
      console.error("Failed to load template", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateTemplate(id, {
        ...formData,
        layout: JSON.parse(formData.layout),
      });
      router.push("/templates");
    } catch (error) {
      console.error("Failed to update template", error);
      alert("Failed to update template");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-dark mb-8">
        Edit Dashboard Template
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-8 rounded-xl border-2 border-light"
      >
        <Input
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <Input
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />

        <div className="flex items-center gap-2 mb-6">
          <input
            type="checkbox"
            id="is_default"
            name="is_default"
            checked={formData.is_default}
            onChange={handleChange}
            className="w-5 h-5 text-primary border-2 border-beige rounded focus:ring-primary"
          />
          <label htmlFor="is_default" className="font-semibold text-dark">
            Set as Default Template
          </label>
        </div>

        <div className="mb-6">
          <label
            htmlFor="layout"
            className="block mb-2 font-semibold text-dark"
          >
            Layout Configuration (JSON)
          </label>
          <p className="text-sm text-gray-500 mb-2">
            Define the grid layout and widgets here. Each widget needs: id,
            type, colSpan, rowSpan
          </p>
          <textarea
            id="layout"
            name="layout"
            value={formData.layout}
            onChange={(e) =>
              setFormData({ ...formData, layout: e.target.value })
            }
            className="w-full px-3 py-2 border-2 border-beige rounded-lg text-base focus:border-primary h-64 font-mono"
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
