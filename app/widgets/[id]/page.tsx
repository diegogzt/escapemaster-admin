"use client";

import React, { useEffect, useState } from "react";
import { getWidget, updateWidget, WidgetDefinition } from "@/services/widgets";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useRouter, useParams } from "next/navigation";

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
    } catch (error) {
      console.error("Failed to load widget", error);
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
    } catch (error) {
      console.error("Failed to update widget", error);
      alert("Failed to update widget");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-dark mb-8">Edit Widget</h1>

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
          label="Slug"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          required
        />
        <Input
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
        <Input
          label="Component Path"
          name="component_path"
          value={formData.component_path}
          onChange={handleChange}
          required
        />

        <div className="mb-6">
          <label
            htmlFor="default_config"
            className="block mb-2 font-semibold text-dark"
          >
            Default Config (JSON)
          </label>
          <textarea
            id="default_config"
            name="default_config"
            value={formData.default_config}
            onChange={(e) =>
              setFormData({ ...formData, default_config: e.target.value })
            }
            className="w-full px-3 py-2 border-2 border-beige rounded-lg text-base focus:border-primary h-32 font-mono"
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
