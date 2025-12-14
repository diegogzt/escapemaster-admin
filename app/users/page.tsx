"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { Card } from "@/components/Card";
import { admin } from "@/services/api";
import Link from "next/link";
import { LayoutDashboard, Building2, LogOut, Users, Mail, Calendar, Shield } from "lucide-react";

export default function AllUsersPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { setTheme } = useTheme();
  const [users, setUsers] = useState<any[]>([]);
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

    loadAllUsers();
  }, [router]);

  const loadAllUsers = async () => {
    try {
      const orgs = await admin.getOrganizations();
      const allUsers = [];
      
      for (const org of orgs) {
        try {
          const orgUsers = await admin.getOrgUsers(org.id);
          const orgRoles = await admin.getOrgRoles(org.id);
          
          // Create role lookup map
          const roleMap = new Map(orgRoles.map((r: any) => [r.id, r.name]));
          
          for (const user of orgUsers) {
            allUsers.push({
              ...user,
              org_name: org.name,
              org_id: org.id,
              role_name: user.role_id ? roleMap.get(user.role_id) || "Sin rol" : "Sin rol"
            });
          }
        } catch (error) {
          console.error(`Error loading users for org ${org.name}:`, error);
        }
      }
      
      setUsers(allUsers);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
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
      <main className="flex-1 ml-64 p-4 md:p-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1F6357] mb-2">Todos los Usuarios</h1>
          <p className="text-sm md:text-base text-gray-700">Lista completa de usuarios en todas las organizaciones</p>
        </div>

        {loading ? (
          <Card className="text-center py-12">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F6357] mb-4"></div>
              <p className="text-[#1F6357] text-lg">Cargando usuarios...</p>
            </div>
          </Card>
        ) : users.length === 0 ? (
          <Card className="text-center py-12">
            <Users size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No hay usuarios</h3>
            <p className="text-gray-600">No se encontraron usuarios en ninguna organización</p>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="bg-[#E8F5F3]">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#1F6357] w-[22%]">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#1F6357] w-[15%]">Nombre</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#1F6357] w-[18%]">Organización</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#1F6357] w-[15%]">Rol</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#1F6357] w-[12%]">Estado</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#1F6357] w-[18%]">Último Login</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user, index) => (
                    <tr 
                      key={user.id} 
                      className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Mail size={16} className="text-gray-400 flex-shrink-0" />
                          <span className="text-sm text-gray-900">{user.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">
                          {user.full_name || "Sin nombre"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/organizations/${user.org_id}`} className="text-sm text-[#1F6357] hover:text-[#164a41] hover:underline font-medium">
                          {user.org_name}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {user.role_name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          user.is_active 
                            ? "bg-green-100 text-green-800" 
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {user.is_active ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-500">
                          {user.last_login 
                            ? new Date(user.last_login).toLocaleDateString('es-ES', { 
                                day: '2-digit', 
                                month: 'short', 
                                year: 'numeric' 
                              })
                            : "Nunca"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-[#1F6357]">Total:</span> {users.length} usuario{users.length !== 1 ? 's' : ''}
              </p>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
