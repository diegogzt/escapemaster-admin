"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { Card } from "@/components/Card";
import { admin } from "@/services/api";
import Link from "next/link";
import { LayoutDashboard, Building2, LogOut, Calendar as CalendarIcon, Users, Shield } from "lucide-react";

export default function AllBookingsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { setTheme } = useTheme();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTheme("tropical");
  }, [setTheme]);

  useEffect(() => {
    const adminToken = localStorage.getItem("admin_token");
    if (!adminToken) {
      router.push("/login");
      return;
    }

    loadStats();
  }, [router]);

  const loadStats = async () => {
    try {
      // For now, show a placeholder message
      setLoading(false);
    } catch (error) {
      console.error("Error loading bookings:", error);
      setLoading(false);
    }
  };

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
      </main>
    </div>
  );
}
