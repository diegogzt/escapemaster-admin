"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname, useParams } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { Card } from "@/components/Card";
import Button from "@/components/Button";
import { admin } from "@/services/api";
import Link from "next/link";
import { LayoutDashboard, Building2, LogOut, ArrowLeft, Shield, Users as UsersIcon, Check, X } from "lucide-react";

export default function RolePermissionsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const { setTheme } = useTheme();
  const [role, setRole] = useState<any>(null);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [rolePermissions, setRolePermissions] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
      loadRoleData();
    }
  }, [params.id, router]);

  const loadRoleData = async () => {
    try {
      // Get all permissions
      const allPerms = await admin.getPermissions();
      setPermissions(allPerms);

      // Get role permissions
      const rolePerms = await admin.getRolePermissions(params.id as string);
      setRolePermissions(new Set(rolePerms.map((p: any) => p.id)));

      // Note: We need to get role details - for now we'll get from org roles
      // This is a limitation, we should add GET /admin/roles/{id} endpoint
      setRole({ id: params.id, name: "Loading..." });
    } catch (error) {
      console.error("Error loading role data:", error);
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = async (permissionId: string) => {
    if (role?.name === "Admin") {
      alert("No puedes modificar los permisos del rol Admin. Siempre tiene todos los permisos.");
      return;
    }

    const hasPermission = rolePermissions.has(permissionId);
    setSaving(true);

    try {
      if (hasPermission) {
        await admin.removePermissionFromRole(params.id as string, permissionId);
        setRolePermissions(prev => {
          const next = new Set(prev);
          next.delete(permissionId);
          return next;
        });
      } else {
        await admin.assignPermissionToRole(params.id as string, permissionId);
        setRolePermissions(prev => new Set([...prev, permissionId]));
      }
    } catch (error: any) {
      console.error("Error toggling permission:", error);
      alert(error.response?.data?.detail || "Error al actualizar permiso");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/login");
  };

  // Group permissions by category
  const permissionsByCategory = permissions.reduce((acc, perm) => {
    if (!acc[perm.category]) {
      acc[perm.category] = [];
    }
    acc[perm.category].push(perm);
    return acc;
  }, {} as Record<string, any[]>);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#E8F5F3] items-center justify-center">
        <p className="text-[#1F6357] text-xl">Cargando...</p>
      </div>
    );
  }

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
              <UsersIcon size={20} />
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
        <Link href="/roles" className="inline-flex items-center text-[#1F6357] hover:text-[#164a41] mb-6">
          <ArrowLeft size={20} className="mr-2" />
          Volver a roles
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1F6357] mb-2">
            Permisos del Rol: {role?.name || "Cargando..."}
          </h1>
          {role?.name === "Admin" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-yellow-800">
                ⚠️ El rol <strong>Admin</strong> siempre tiene todos los permisos y no puede ser modificado.
              </p>
            </div>
          )}
          <p className="text-gray-700">Gestiona los permisos asignados a este rol</p>
        </div>

        <div className="space-y-6">
          {Object.entries(permissionsByCategory).map(([category, perms]) => (
            <Card key={category} className="p-6">
              <h2 className="text-xl font-bold text-[#1F6357] mb-4 capitalize">
                {category}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(perms as any[]).map((permission) => {
                  const hasPermission = rolePermissions.has(permission.id);
                  const isAdmin = role?.name === "Admin";
                  
                  return (
                    <div 
                      key={permission.id}
                      className={`flex items-center justify-between p-3 rounded-lg border-2 transition-colors ${
                        hasPermission 
                          ? "border-green-300 bg-green-50" 
                          : "border-gray-200 bg-white"
                      } ${!isAdmin && "cursor-pointer hover:border-[#1F6357]"}`}
                      onClick={() => !isAdmin && !saving && togglePermission(permission.id)}
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-sm">
                          {permission.permission_key}
                        </p>
                        <p className="text-xs text-gray-600">
                          {permission.description}
                        </p>
                      </div>
                      
                      <div className="ml-3">
                        {hasPermission ? (
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <Check size={16} className="text-white" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <X size={16} className="text-gray-500" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center text-gray-600">
          <p>Total de permisos: {permissions.length}</p>
          <p>Permisos asignados: {rolePermissions.size}</p>
        </div>
      </main>
    </div>
  );
}
