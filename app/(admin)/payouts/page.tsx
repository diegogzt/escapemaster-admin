"use client";

import React, { useEffect, useState, useCallback } from "react";
import { admin } from "@/services/api";
import { Card } from "@/components/Card";
import Button from "@/components/Button";
import {
  Wallet,
  Building2,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

interface PayoutSummary {
  organization_id: string;
  organization_name: string;
  pending_amount: number;
  bookings_count: number;
  period_start: string;
  period_end: string;
  bank_account_verified: boolean;
}

export default function PayoutsPage() {
  const [pendingPayouts, setPendingPayouts] = useState<PayoutSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPendingPayouts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await admin.getPendingPayouts();
      // API returns array of payout summaries
      const payouts: PayoutSummary[] = Array.isArray(data) ? data : data.items || [];
      setPendingPayouts(payouts);
    } catch (err: any) {
      console.error("Error loading pending payouts:", err);
      setError(err.response?.data?.detail || "Error al cargar pagos pendientes");
      setPendingPayouts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPendingPayouts();
  }, [loadPendingPayouts]);

  const handleProcessPayouts = async () => {
    if (!confirm("¿Procesar todos los pagos pendientes? Esta acción iniciará las transferencias bancarias.")) {
      return;
    }

    try {
      setProcessing(true);
      await admin.processPayouts();
      await loadPendingPayouts();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Error al procesar pagos");
    } finally {
      setProcessing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(amount);
  };

  const totalPending = pendingPayouts.reduce((sum, p) => sum + p.pending_amount, 0);
  const verifiedCount = pendingPayouts.filter((p) => p.bank_account_verified).length;

  // Calculate next Monday for payout date
  const getNextMonday = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = day === 0 ? 1 : 8 - day;
    const next = new Date(now);
    next.setDate(now.getDate() + diff);
    return next.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1F6357]">Gestión de Pagos</h1>
          <p className="text-gray-600 mt-1">Liquidaciones semanales a empresas</p>
        </div>
        <Button
          onClick={handleProcessPayouts}
          disabled={processing || verifiedCount === 0}
          className="bg-[#1F6357] hover:bg-[#164a41] text-white flex items-center space-x-2"
        >
          <Wallet size={18} />
          <span>{processing ? "Procesando..." : "Procesar Pagos"}</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Pendiente</p>
              <p className="text-2xl font-bold text-gray-800">{formatCurrency(totalPending)}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
              <Building2 size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Empresas</p>
              <p className="text-2xl font-bold text-gray-800">{pendingPayouts.length}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Próximo Pago</p>
              <p className="text-lg font-bold text-gray-800">{getNextMonday()}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Error */}
      {error && (
        <Card className="mb-6 bg-red-50 border border-red-200">
          <div className="flex items-center gap-3 text-red-700">
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        </Card>
      )}

      {/* Pending Payouts List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F6357]" />
        </div>
      ) : pendingPayouts.length === 0 && !error ? (
        <Card className="text-center py-16">
          <CheckCircle2 className="mx-auto text-green-500 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-700">Sin pagos pendientes</h3>
          <p className="text-gray-500 mt-2">Todas las liquidaciones están al día</p>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-gray-500 px-4">
            <span>Empresa</span>
            <span>Reservas</span>
            <span>Período</span>
            <span>Cuenta Bancaria</span>
            <span>Monto</span>
          </div>

          {pendingPayouts.map((payout) => (
            <Card key={payout.organization_id} className="hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-10 h-10 bg-[#E8F5F3] rounded-lg flex items-center justify-center text-[#1F6357]">
                    <Building2 size={20} />
                  </div>
                  <h3 className="font-semibold text-gray-800">{payout.organization_name}</h3>
                </div>

                <div className="text-center px-4 flex-shrink-0">
                  <p className="font-semibold text-gray-700">{payout.bookings_count}</p>
                  <p className="text-xs text-gray-500">reservas</p>
                </div>

                <div className="text-center px-4 flex-shrink-0">
                  <p className="text-sm text-gray-600">
                    {new Date(payout.period_start).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
                    {" - "}
                    {new Date(payout.period_end).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
                  </p>
                </div>

                <div className="text-center px-4 flex-shrink-0">
                  {payout.bank_account_verified ? (
                    <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      <CheckCircle2 size={12} className="mr-1" />
                      Verificada
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                      <AlertCircle size={12} className="mr-1" />
                      Pendiente
                    </span>
                  )}
                </div>

                <div className="text-right pl-4 flex-shrink-0">
                  <p className="text-xl font-bold text-[#1F6357]">{formatCurrency(payout.pending_amount)}</p>
                </div>

                <div className="pl-4 flex-shrink-0">
                  <button className="p-2 text-gray-400 hover:text-[#1F6357] transition-colors">
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Info Section */}
      <Card className="mt-8 bg-gray-50">
        <h4 className="font-semibold text-gray-800 mb-4">Información de Pagos</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-start space-x-2">
            <Clock className="text-gray-400 mt-0.5" size={16} />
            <div>
              <p className="font-medium">Ciclo de pagos</p>
              <p>Los pagos se procesan cada lunes para el período de la semana anterior</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <Wallet className="text-gray-400 mt-0.5" size={16} />
            <div>
              <p className="font-medium">Comisiones</p>
              <p>Según el plan contratado por la organización</p>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}
