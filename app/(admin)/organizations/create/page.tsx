"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardFooter } from "@/components/Card";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { admin } from "@/services/api";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CreateOrgPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bookingManager, setBookingManager] = useState("internal");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.target as HTMLFormElement);

    try {
      await admin.createOrganization({
        name: formData.get("name"),
        description: formData.get("description"),
        booking_manager: formData.get("booking_manager"),
        erd_url: formData.get("erd_url"),
      });
      router.push("/organizations");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Error al crear organización");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Link href="/organizations" className="inline-flex items-center text-[#1F6357] hover:text-[#164a41] mb-6">
        <ArrowLeft size={20} className="mr-2" />
        Volver a organizaciones
      </Link>

      <h1 className="text-3xl font-bold text-[#1F6357] mb-2">Crear Organización</h1>
      <p className="text-gray-700 mb-8">Crea una nueva organización en el sistema</p>

      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <Input name="name" label="Nombre de la Organización" type="text" placeholder="Ej: Escape Room Madrid" required />
            <Input name="description" label="Descripción (opcional)" type="text" placeholder="Descripción de la organización" />
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
            {bookingManager === "er_director" && (
              <Input name="erd_url" label="URL del sitio web de ER Director" type="url" placeholder="https://www.residentriddle.es/" required />
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
    </>
  );
}
