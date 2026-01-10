"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/Card";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { admin, API_URL } from "@/services/api";
import { Lock } from "lucide-react";

export default function EMAdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const data = await admin.login({ email, password });

      localStorage.setItem("admin_token", data.access_token);
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Admin login failed", err);
      
      if (err.code === 'ERR_NETWORK') {
        setError(`No se puede conectar con el servidor API (${API_URL}). CORS o Error de Red.`);
      } else if (err.response?.status === 401) {
        setError("Credenciales de administrador inválidas");
      } else {
        setError(`Error: ${err.message || "Error desconocido"}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#E8F5F3]">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur">
        <CardHeader>
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-[#1F6357] rounded-full flex items-center justify-center mb-4">
              <Lock className="text-white" size={24} />
            </div>
            <div className="text-[#1F6357]">
              <CardTitle>EM Admin Access</CardTitle>
            </div>
            <p className="text-gray-700">Panel de Super Administración</p>
          </div>
        </CardHeader>
        
        <form onSubmit={handleLogin}>
          <div className="space-y-4 px-6">
            <Input
              name="email"
              label="Admin Email"
              type="email"
              placeholder="admin@escapemaster.com"
              required
            />
            <Input
              name="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}

          <CardFooter className="px-6 pb-6 pt-4">
            <Button type="submit" block loading={loading} className="bg-[#1F6357] hover:bg-[#164a41]">
              Acceder al Sistema
            </Button>
          </CardFooter>
        </form>
        <div className="text-xs text-gray-400 text-center pb-4">
            API: {API_URL}
        </div>
      </Card>
    </div>
  );
}
