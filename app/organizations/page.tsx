"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { admin } from "@/services/api";
import { Card } from "@/components/Card";
import { Sidebar } from "@/components/Sidebar";
import Link from "next/link";
import { Building2, Users } from "lucide-react";

export default function OrganizationsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { setTheme } = useTheme();
  const [orgs, setOrgs] = useState<any[]>([]);

  useEffect(() => {
    setTheme("tropical");
  }, [setTheme]);

  useEffect(() => {
    const adminToken = localStorage.getItem("admin_token");
    if (!adminToken) {
      router.push("/login");
      return;
    }
    
    admin.getOrganizations()
      .then(setOrgs)
      .catch(console.error);
  }, [router]);



  return (
    <div className="flex min-h-screen bg-[#E8F5F3]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1F6357]">Organizaciones</h1>
          </div>
          <Link href="/organizations/create">
            <button className="bg-[#1F6357] hover:bg-[#164a41] text-white px-4 py-2 rounded-lg transition-colors">
              + Nueva Organización
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orgs.map((org) => (
            <Link key={org.id} href={`/organizations/${org.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-[#E8F5F3] rounded-lg flex items-center justify-center text-[#1F6357]">
                    <Building2 size={24} />
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${org.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {org.is_active ? "Activa" : "Inactiva"}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-2">{org.name}</h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{org.description || "Sin descripción"}</p>
                
                <div className="border-t border-gray-100 pt-4 mt-4 flex justify-between items-center text-sm text-gray-600">
                  <div className="flex items-center">
                    <Users size={16} className="mr-2" />
                    <span>{org.subscription_plan}</span>
                  </div>
                  <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                    {org.invitation_code}
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
