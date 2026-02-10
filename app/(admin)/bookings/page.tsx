"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/Card";
import { Calendar as CalendarIcon } from "lucide-react";

export default function AllBookingsPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1F6357] mb-2">Todas las Reservas</h1>
        <p className="text-gray-700">Vista global de reservas en todas las organizaciones</p>
      </div>

      <Card className="text-center py-12">
        <CalendarIcon size={64} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Próximamente</h3>
        <p className="text-gray-600 mb-6">
          La vista global de reservas estará disponible pronto.
          <br />
          Por ahora, puedes ver las reservas por organización.
        </p>
        <Link href="/organizations">
          <button className="bg-[#1F6357] hover:bg-[#164a41] text-white px-6 py-2 rounded-lg transition-colors">
            Ver Organizaciones
          </button>
        </Link>
      </Card>
    </>
  );
}
