"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/Card";
import { admin } from "@/services/api";
import Link from "next/link";
import { ArrowLeft, Shield, Check, X } from "lucide-react";

interface Permission {
  id: string;
  permission_key: string;
  description: string;
  category: string;
}

export default function RolePermissionsPage() {
  const params = useParams();
  const [role, setRole] = useState<{ id: string; name: string } | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (params.id) {
      loadRoleData();
    }
  }, [params.id]);

  const loadRoleData = async () => {
    try {
      const [allPerms, rolePerms] = await Promise.all([
        admin.getPermissions(),
        admin.getRolePermissions(params.id as string),
      ]);

      setPermissions(allPerms);
      setRolePermissions(new Set(rolePerms.map((p: Permission) => p.id)));
      setRole({ id: params.id as string, name: "Rol" });
    } catch {
      // handled by empty state
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = async (permissionId: string) => {
    if (role?.name === "Admin") return;

    const hasPermission = rolePermissions.has(permissionId);
    setSaving(true);

    try {
      if (hasPermission) {
        await admin.removePermissionFromRole(params.id as string, permissionId);
        setRolePermissions((prev) => {
          const next = new Set(prev);
          next.delete(permissionId);
          return next;
        });
      } else {
        await admin.assignPermissionToRole(params.id as string, permissionId);
        setRolePermissions((prev) => new Set([...prev, permissionId]));
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Error al actualizar permiso";
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  const permissionsByCategory = permissions.reduce<Record<string, Permission[]>>((acc, perm) => {
    if (!acc[perm.category]) acc[perm.category] = [];
    acc[perm.category].push(perm);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F6357]" />
      </div>
    );
  }

  return (
    <>
      <Link href="/roles" className="inline-flex items-center text-[#1F6357] hover:text-[#164a41] mb-6">
        <ArrowLeft size={20} className="mr-2" />
        Volver a roles
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1F6357] mb-2">
          <Shield className="inline mr-2" size={28} />
          Permisos del Rol: {role?.name || "—"}
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
            <h2 className="text-xl font-bold text-[#1F6357] mb-4 capitalize">{category}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {perms.map((permission) => {
                const hasPermission = rolePermissions.has(permission.id);
                const isAdmin = role?.name === "Admin";

                return (
                  <div
                    key={permission.id}
                    className={`flex items-center justify-between p-3 rounded-lg border-2 transition-colors ${
                      hasPermission ? "border-green-300 bg-green-50" : "border-gray-200 bg-white"
                    } ${!isAdmin ? "cursor-pointer hover:border-[#1F6357]" : ""}`}
                    onClick={() => !isAdmin && !saving && togglePermission(permission.id)}
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 text-sm">{permission.permission_key}</p>
                      <p className="text-xs text-gray-600">{permission.description}</p>
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
    </>
  );
}
