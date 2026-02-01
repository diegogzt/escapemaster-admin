"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Building2, Users, Shield, LogOut, Gamepad2 } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/login");
  };

  const isActive = (path: string) => {
    if (path === "/dashboard" && pathname === "/dashboard") return true;
    if (path !== "/dashboard" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <aside className="w-64 bg-[#1F6357] text-white flex flex-col fixed h-full z-10">
      <div className="p-6 border-b border-[#2A7A6B]">
        <h1 className="text-2xl font-bold">EM Admin</h1>
        <p className="text-sm opacity-75">EscapeMaster Admin</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <Link href="/dashboard">
          <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive("/dashboard") ? "bg-[#2A7A6B]" : "hover:bg-[#2A7A6B]/50"}`}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </div>
        </Link>
        <Link href="/organizations">
          <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive("/organizations") ? "bg-[#2A7A6B]" : "hover:bg-[#2A7A6B]/50"}`}>
            <Building2 size={20} />
            <span>Organizaciones</span>
          </div>
        </Link>
        <Link href="/rooms">
          <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive("/rooms") ? "bg-[#2A7A6B]" : "hover:bg-[#2A7A6B]/50"}`}>
             <Gamepad2 size={20} />
            <span>Salas</span>
          </div>
        </Link>
        <Link href="/users">
          <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive("/users") ? "bg-[#2A7A6B]" : "hover:bg-[#2A7A6B]/50"}`}>
            <Users size={20} />
            <span>Usuarios</span>
          </div>
        </Link>
        <Link href="/roles">
          <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive("/roles") ? "bg-[#2A7A6B]" : "hover:bg-[#2A7A6B]/50"}`}>
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
  );
}
