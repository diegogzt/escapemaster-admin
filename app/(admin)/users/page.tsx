"use client";

import React, { useState, useEffect } from "react";
import { admin } from "@/services/api";
import { Card } from "@/components/Card";
import Link from "next/link";
import { Users, Mail } from "lucide-react";

export default function AllUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllUsers();
  }, []);

  const loadAllUsers = async () => {
    try {
      const orgs = await admin.getOrganizations();
      const allUsers: any[] = [];

      for (const org of orgs) {
        try {
          const orgUsers = await admin.getOrgUsers(org.id);
          const orgRoles = await admin.getOrgRoles(org.id);
          const roleMap = new Map(orgRoles.map((r: any) => [r.id, r.name]));

          for (const user of orgUsers) {
            allUsers.push({
              ...user,
              org_name: org.name,
              org_id: org.id,
              role_name: user.role_id ? roleMap.get(user.role_id) || "Sin rol" : "Sin rol",
            });
          }
        } catch {
          // Skip orgs with errors
        }
      }

      setUsers(allUsers);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="text-center py-12">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F6357] mb-4" />
          <p className="text-[#1F6357] text-lg">Cargando usuarios...</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1F6357] mb-2">Todos los Usuarios</h1>
        <p className="text-sm md:text-base text-gray-700">Lista completa de usuarios en todas las organizaciones</p>
      </div>

      {users.length === 0 ? (
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
                    className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="text-gray-400 flex-shrink-0" />
                        <span className="text-sm text-gray-900">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">{user.full_name || "Sin nombre"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/organizations/${user.org_id}`}
                        className="text-sm text-[#1F6357] hover:text-[#164a41] hover:underline font-medium"
                      >
                        {user.org_name}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {user.role_name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          user.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.is_active ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">
                        {user.last_login
                          ? new Date(user.last_login).toLocaleDateString("es-ES", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
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
              <span className="font-semibold text-[#1F6357]">Total:</span> {users.length} usuario{users.length !== 1 ? "s" : ""}
            </p>
          </div>
        </Card>
      )}
    </>
  );
}
