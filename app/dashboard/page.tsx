"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { Card } from "@/components/Card";
import Link from "next/link";
import { admin } from "@/services/api";
import { LayoutDashboard, Building2, LogOut, Users, Calendar, Activity, Building2 as Building2Icon, Shield } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { setTheme } = useTheme();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    // Enforce Tropical theme
    setTheme("tropical");
  }, [setTheme]);

  // Check for admin token
  useEffect(() => {
    const adminToken = localStorage.getItem("admin_token");
    if (!adminToken) {
      router.push("/login");
    }
  }, [pathname, router]);

  useEffect(() => {
    admin.getStats()
      .then(setStats)
      .catch(console.error);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#E8F5F3]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1F6357] text-white flex flex-col fixed h-full">
        <div className="p-6 border-b border-[#2A7A6B]">
          <h1 className="text-2xl font-bold">EM Admin</h1>
          <p className="text-sm opacity-75">EscapeMaster Admin</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard">
            <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${pathname === "/dashboard" ? "bg-[#2A7A6B]" : "hover:bg-[#2A7A6B]/50"}`}>
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </div>
          </Link>
          <Link href="/organizations">
            <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${pathname.includes("/organizations") ? "bg-[#2A7A6B]" : "hover:bg-[#2A7A6B]/50"}`}>
              <Building2 size={20} />
              <span>Organizaciones</span>
            </div>
          </Link>
          <Link href="/users">
            <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${pathname === "/users" ? "bg-[#2A7A6B]" : "hover:bg-[#2A7A6B]/50"}`}>
              <Users size={20} />
              <span>Usuarios</span>
            </div>
          </Link>
          <Link href="/roles">
            <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${pathname === "/roles" ? "bg-[#2A7A6B]" : "hover:bg-[#2A7A6B]/50"}`}>
              <Shield size={20} />
              <span>Roles</span>
            </div>
          </Link>
        </nav>

        <div className="p-4 border-t border-[#2A7A6B]">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg hover:bg-[#2A7A6B]/50 text-red-200 hover:text-red-100 transition-colors"
          >
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold text-[#1F6357] mb-2">Vista General</h1>
        <p className="text-gray-600 mb-8">Estadísticas globales del sistema EscapeMaster</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/organizations">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Organizaciones</p>
                  <p className="text-3xl font-bold text-[#1F6357]">{stats?.total_organizations || "..."}</p>
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
                  <p className="text-3xl font-bold text-[#1F6357]">{stats?.total_users || "..."}</p>
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
                  <p className="text-3xl font-bold text-[#1F6357]">{stats?.total_bookings || "..."}</p>
                </div>
                <Calendar size={40} className="text-[#1F6357]" />
              </div>
            </Card>
          </Link>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Orgs Activas</p>
                <p className="text-3xl font-bold text-green-600">{stats?.active_organizations || "..."}</p>
              </div>
              <Activity size={40} className="text-green-600" />
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
