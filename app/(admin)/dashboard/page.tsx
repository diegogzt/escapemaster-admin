"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { admin } from "@/services/api";
import { Card } from "@/components/Card";
import { Building2, Users, Calendar, Activity } from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState<{
    total_organizations?: number;
    total_users?: number;
    total_bookings?: number;
    active_organizations?: number;
  } | null>(null);

  useEffect(() => {
    admin.getStats().then(setStats).catch(console.error);
  }, []);

  return (
    <>
      <h1 className="text-3xl font-bold text-[#1F6357] mb-2">Vista General</h1>
      <p className="text-gray-600 mb-8">Estadísticas globales del sistema EscapeMaster</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link href="/organizations">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Organizaciones</p>
                <p className="text-3xl font-bold text-[#1F6357]">{stats?.total_organizations ?? "..."}</p>
              </div>
              <Building2 className="text-[#1F6357]" size={40} />
            </div>
          </Card>
        </Link>

        <Link href="/users">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Usuarios</p>
                <p className="text-3xl font-bold text-[#1F6357]">{stats?.total_users ?? "..."}</p>
              </div>
              <Users size={40} className="text-[#1F6357]" />
            </div>
          </Card>
        </Link>

        <Link href="/bookings">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Reservas</p>
                <p className="text-3xl font-bold text-[#1F6357]">{stats?.total_bookings ?? "..."}</p>
              </div>
              <Calendar size={40} className="text-[#1F6357]" />
            </div>
          </Card>
        </Link>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Orgs Activas</p>
              <p className="text-3xl font-bold text-green-600">{stats?.active_organizations ?? "..."}</p>
            </div>
            <Activity size={40} className="text-green-600" />
          </div>
        </Card>
      </div>
    </>
  );
}
