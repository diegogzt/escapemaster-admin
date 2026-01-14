"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname, useParams } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { Card } from "@/components/Card";
import Button from "@/components/Button";
import { admin } from "@/services/api";
import Link from "next/link";
import { LayoutDashboard, Building2, LogOut, ArrowLeft, Users, Shield, Plus } from "lucide-react";
import axios from "axios";
import { API_URL } from "@/services/api";

export default function OrgDetailPage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const { setTheme } = useTheme();
  const [org, setOrg] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
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

    if (params.id) {
      loadOrgData();
    }
  }, [params.id, router]);

  const loadOrgData = async () => {
    try {
      const orgsData = await admin.getOrganizations();
      const currentOrg = orgsData.find((o: any) => o.id === params.id);
      setOrg(currentOrg);

      const [usersData, rolesData, roomsData] = await Promise.all([
        admin.getOrgUsers(params.id as string),
        admin.getOrgRoles(params.id as string),
        // Adding a hypothetical getOrgRooms if it exists or using rooms from org if returned
        axios.get(`${API_URL}/admin/organizations/${params.id}/rooms`).then(res => res.data).catch(() => [])
      ]);

      setUsers(usersData);
      setRoles(rolesData);
      setRooms(roomsData);
    } catch (error) {
      console.error("Error loading org data:", error);
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
            <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${pathname.startsWith("/roles") ? "bg-[#2A7A6B]" : "hover:bg-[#2A7A6B]/50"}`}>
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
        {loading ? (
          <Card className="text-center py-12">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F6357] mb-4"></div>
              <p className="text-[#1F6357] text-lg">Cargando organización...</p>
            </div>
          </Card>
        ) : !org ? (
          <Card className="text-center py-12">
            <Building2 size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Organización no encontrada</h3>
            <p className="text-gray-600 mb-4">No se pudo cargar la información de esta organización</p>
            <Link href="/organizations">
              <Button className="bg-[#1F6357] hover:bg-[#164a41]">
                Volver a Organizaciones
              </Button>
            </Link>
          </Card>
        ) : (
          <>
            <Link href="/organizations" className="inline-flex items-center text-[#1F6357] hover:text-[#164a41] mb-6">
              <ArrowLeft size={20} className="mr-2" />
              Volver a organizaciones
            </Link>

            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#1F6357] mb-2">{org.name}</h1>
              <p className="text-gray-700">{org.description || "Sin descripción"}</p>
              <div className="flex gap-2 mt-4">
                <span className={`px-3 py-1 text-sm rounded-full ${org.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {org.is_active ? "Activa" : "Inactiva"}
                </span>
                <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700">
                  {org.subscription_plan}
                </span>
                <span className="px-3 py-1 text-sm rounded-full bg-purple-100 text-purple-700">
                  Gestor: {org.booking_manager === 'er_director' ? 'ER Director' : 'Interno'}
                </span>
              </div>
              {org.booking_manager === 'er_director' && org.erd_url && (
                <p className="text-sm text-gray-500 mt-2 font-mono">
                  URL ERD: {org.erd_url}
                </p>
              )}
            </div>

        {/* Users Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-[#1F6357] flex items-center gap-2">
              <Users size={24} />
              Usuarios ({users.length})
            </h2>
            <Link href={`/organizations/${params.id}/users/create`}>
              <Button className="bg-[#1F6357] hover:bg-[#164a41]">
                <Plus size={18} className="mr-2" />
                Añadir Usuario
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.length === 0 ? (
              <p className="text-gray-500 col-span-full">No hay usuarios en esta organización</p>
            ) : (
              users.map((user) => (
                <Card key={user.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-gray-800">{user.name || user.email}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${ user.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                      {user.is_active ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Roles Section */}
        <div>
          <h2 className="text-2xl font-bold text-[#1F6357] flex items-center gap-2 mb-4">
            <Shield size={24} />
            Roles ({roles.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.length === 0 ? (
              <p className="text-gray-500 col-span-full">No hay roles configurados</p>
            ) : (
              roles.map((role) => (
                <Card key={role.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-gray-800">{role.name}</h3>
                    {!role.is_custom && (
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                        Sistema
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{role.description || "Sin descripción"}</p>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Rooms Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-[#1F6357] flex items-center gap-2 mb-4">
            <LayoutDashboard size={24} />
            Salas / Juegos ({rooms.length})
          </h2>

          <div className="grid grid-cols-1 gap-4 pb-20">
            {rooms.length === 0 ? (
              <p className="text-gray-500">No hay salas configuradas en esta organización</p>
            ) : (
              rooms.map((room) => (
                <Card key={room.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{room.name}</h3>
                      <p className="text-sm text-gray-600">ID: {room.id}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      {org.booking_manager === 'er_director' && (
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">ER Director Game ID</label>
                          <input 
                            type="text"
                            defaultValue={room.erd_game_id}
                            placeholder="Ej: 221"
                            className="text-right px-2 py-1 border border-gray-200 rounded-md focus:ring-1 ring-[#1F6357] outline-none text-gray-700"
                            onBlur={async (e) => {
                                try {
                                    await axios.put(`${API_URL}/admin/rooms/${room.id}`, { erd_game_id: e.target.value });
                                } catch (err) {
                                    console.error("Error updating room erd_game_id:", err);
                                }
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
          </>
        )}
      </main>
    </div>
  );
}
