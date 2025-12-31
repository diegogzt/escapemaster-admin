"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname, useParams } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/Card";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { admin } from "@/services/api";
import Link from "next/link";
import { LayoutDashboard, Building2, LogOut, ArrowLeft } from "lucide-react";

export default function CreateUserInOrgPage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const { setTheme } = useTheme();
  const [org, setOrg] = useState<any>(null);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

      const rolesData = await admin.getOrgRoles(params.id as string);
      setRoles(rolesData);
    } catch (error) {
      console.error("Error loading org data:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email");
    const password = formData.get("password");
    const full_name = formData.get("full_name");
    const role_id = formData.get("role_id");

    try {
      await admin.createUserInOrg(params.id as string, {
        email,
        password,
        full_name: full_name || undefined,
        role_id: role_id || undefined,
      });
      router.push(`/organizations/${params.id}`);
    } catch (err: any) {
      console.error("Error creating user:", err);
      
      // Handle validation errors from FastAPI
      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        if (Array.isArray(detail)) {
          // Pydantic validation errors
          const errorMessages = detail.map((e: any) => `${e.loc.join('.')}: ${e.msg}`).join(', ');
          setError(errorMessages);
        } else if (typeof detail === 'string') {
          setError(detail);
        } else {
          setError("Error al crear usuario");
        }
      } else {
        setError("Error al crear usuario");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/login");
  };

  if (!org) {
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
        <Link href={`/organizations/${params.id}`} className="inline-flex items-center text-[#1F6357] hover:text-[#164a41] mb-6">
          <ArrowLeft size={20} className="mr-2" />
          Volver a {org.name}
        </Link>

        <h1 className="text-3xl font-bold text-[#1F6357] mb-2">Añadir Usuario</h1>
        <p className="text-gray-700 mb-8">Crea un nuevo usuario en {org.name}</p>

        <Card className="max-w-2xl shadow-xl border-t-4 border-t-[#1F6357]">
          <form onSubmit={handleSubmit}>
            <div className="p-8 space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <div className="md:col-span-2">
                  <Input
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="usuario@ejemplo.com"
                    required
                  />
                </div>
                
                <Input
                  name="password"
                  label="Contraseña"
                  type="password"
                  placeholder="••••••••"
                  required
                />
                
                <Input
                  name="full_name"
                  label="Nombre Completo"
                  type="text"
                  placeholder="Nombre del usuario"
                  required
                />
                
                <div className="md:col-span-2 mt-2">
                  <label htmlFor="role_id" className="block mb-2 font-semibold text-gray-800">Rol (opcional)</label>
                  <select
                    id="role_id"
                    name="role_id"
                    className="w-full px-3 py-2 border-2 border-beige rounded-lg text-base transition-colors bg-white text-gray-900 focus:border-primary outline-none"
                  >
                    <option value="">Sin rol asignado</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-2">
                    El rol determina los permisos que tendrá el usuario en la organización.
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <div className="mx-8 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}

            <CardFooter className="px-8 pb-8 pt-6 flex flex-col sm:flex-row gap-4">
              <Link href={`/organizations/${params.id}`} className="flex-1">
                <Button type="button" className="w-full bg-gray-500 hover:bg-gray-600">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" loading={loading} className="flex-1 bg-[#1F6357] hover:bg-[#164a41]">
                Crear Usuario
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
}
