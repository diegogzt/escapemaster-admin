"use client";

import React, { useState, useEffect } from "react";
import { admin } from "@/services/api";
import { Card } from "@/components/Card";
import Button from "@/components/Button";
import Link from "next/link";
import { Shield, Settings } from "lucide-react";

export default function RolesPage() {
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    try {
      const orgs = await admin.getOrganizations();
      setOrganizations(orgs);
      if (orgs.length > 0) {
        setSelectedOrg(orgs[0].id);
        loadRoles(orgs[0].id);
      }
    } catch (error) {
      console.error("Error loading organizations:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadRoles = async (orgId: string) => {
    try {
      const rolesData = await admin.getOrgRoles(orgId);
      setRoles(rolesData);
    } catch (error) {
      console.error("Error loading roles:", error);
    }
  };

  const handleOrgChange = (orgId: string) => {
    setSelectedOrg(orgId);
    loadRoles(orgId);
  };

  if (loading) {
    return (
      <Card className="text-center py-12">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F6357] mb-4" />
          <p className="text-[#1F6357] text-lg">Cargando roles...</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1F6357] mb-2">Gestión de Roles</h1>
        <p className="text-gray-700">Gestiona roles y permisos por organización</p>
      </div>

      {/* Organization Selector */}
      <Card className="mb-6 p-4">
        <label className="block mb-2 font-semibold text-gray-800">Seleccionar Organización</label>
        <select
          value={selectedOrg || ""}
          onChange={(e) => handleOrgChange(e.target.value)}
          className="w-full max-w-md px-3 py-2 border-2 border-beige rounded-lg text-base transition-colors bg-white text-gray-900 focus:border-primary"
        >
          {organizations.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>
      </Card>

      {/* Roles Grid */}
      {selectedOrg && roles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role) => (
            <Card key={role.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#E8F5F3] rounded-lg flex items-center justify-center">
                    <Shield className="text-[#1F6357]" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">{role.name}</h3>
                    {!role.is_custom && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Sistema</span>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">{role.description || "Sin descripción"}</p>

              <div className="border-t border-gray-100 pt-4 mt-4 flex gap-2">
                <Link href={`/roles/${role.id}`} className="flex-1">
                  <Button className="w-full bg-[#1F6357] hover:bg-[#164a41] flex items-center justify-center gap-2">
                    <Settings size={16} />
                    Gestionar Permisos
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}

      {selectedOrg && roles.length === 0 && (
        <Card className="text-center py-12">
          <Shield size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No hay roles</h3>
          <p className="text-gray-600">Esta organización no tiene roles configurados</p>
        </Card>
      )}
    </>
  );
}
