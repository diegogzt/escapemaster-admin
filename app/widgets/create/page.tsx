"use client";

import React, { useState } from "react";
import { createWidget } from "@/services/widgets";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useRouter } from "next/navigation";

export default function CreateWidgetPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    component_path: "",
    default_config: "{}",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createWidget({
        ...formData,
        default_config: JSON.parse(formData.default_config),
      });
      router.push("/widgets");
    } catch (error) {
      console.error("Failed to create widget", error);
      alert("Failed to create widget");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-dark mb-8">Create New Widget</h1>

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
          placeholder="e.g. Revenue Chart"
        />
        <Input
          label="Slug"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          required
          placeholder="e.g. revenue-chart"
        />
        <Input
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Brief description of the widget"
        />
        <Input
          label="Component Path"
          name="component_path"
          value={formData.component_path}
          onChange={handleChange}
          required
          placeholder="e.g. charts/RevenueChart"
          helpText="Path relative to the widgets directory in the frontend"
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
          <Button type="submit" loading={loading}>
            Create Widget
          </Button>
        </div>
      </form>
    </div>
  );
}
