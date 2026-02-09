"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { admin } from "@/services/api";
import { Card } from "@/components/Card";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/Button";
import { 
  FileCheck, 
  FileX, 
  Building2, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Eye,
  AlertTriangle
} from "lucide-react";

interface KYBDocument {
  id: string;
  organization_id: string;
  organization_name: string;
  document_type: string;
  file_url: string;
  status: string;
  uploaded_at: string;
  cif?: string;
}

export default function KYBVerificationPage() {
  const router = useRouter();
  const { setTheme } = useTheme();
  const [documents, setDocuments] = useState<KYBDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<KYBDocument | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    setTheme("tropical");
  }, [setTheme]);

  useEffect(() => {
    const adminToken = localStorage.getItem("admin_token");
    if (!adminToken) {
      router.push("/login");
      return;
    }
    
    loadPendingDocuments();
  }, [router]);

  const loadPendingDocuments = async () => {
    try {
      setLoading(true);
      const data = await admin.getPendingKYB();
      setDocuments(data);
    } catch (error) {
      console.error("Error loading pending KYB documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (docId: string) => {
    try {
      setProcessing(true);
      await admin.reviewKYBDocument(docId, { status: "approved" });
      setDocuments(documents.filter(d => d.id !== docId));
      setSelectedDoc(null);
    } catch (error) {
      console.error("Error approving document:", error);
      alert("Error al aprobar documento");
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (docId: string) => {
    if (!rejectionReason.trim()) {
      alert("Por favor, indica el motivo del rechazo");
      return;
    }
    
    try {
      setProcessing(true);
      await admin.reviewKYBDocument(docId, { 
        status: "rejected",
        rejection_reason: rejectionReason 
      });
      setDocuments(documents.filter(d => d.id !== docId));
      setSelectedDoc(null);
      setRejectionReason("");
    } catch (error) {
      console.error("Error rejecting document:", error);
      alert("Error al rechazar documento");
    } finally {
      setProcessing(false);
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      "cif_certificate": "Certificado CIF",
      "legal_representative_id": "DNI Representante Legal",
      "company_deed": "Escrituras de Constitución",
      "bank_account_proof": "Justificante Cuenta Bancaria",
      "other": "Otro"
    };
    return labels[type] || type;
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      "pending": "bg-yellow-100 text-yellow-700",
      "approved": "bg-green-100 text-green-700",
      "rejected": "bg-red-100 text-red-700"
    };
    const labels: Record<string, string> = {
      "pending": "Pendiente",
      "approved": "Aprobado",
      "rejected": "Rechazado"
    };
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${styles[status] || "bg-gray-100 text-gray-700"}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#E8F5F3]">
      <Sidebar />

      <main className="flex-1 ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1F6357]">Verificación KYB</h1>
            <p className="text-gray-600 mt-1">
              Revisa y aprueba los documentos de verificación de empresas
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm flex items-center">
              <Clock className="text-yellow-500 mr-2" size={20} />
              <span className="font-semibold">{documents.length}</span>
              <span className="text-gray-500 ml-1">pendientes</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F6357]"></div>
          </div>
        ) : documents.length === 0 ? (
          <Card className="text-center py-16">
            <CheckCircle2 className="mx-auto text-green-500 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-700">Todo al día</h3>
            <p className="text-gray-500 mt-2">No hay documentos pendientes de revisión</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Document List */}
            <div className="space-y-4">
              {documents.map((doc) => (
                <Card 
                  key={doc.id} 
                  className={`cursor-pointer transition-all ${
                    selectedDoc?.id === doc.id 
                      ? "ring-2 ring-[#1F6357] shadow-lg" 
                      : "hover:shadow-md"
                  }`}
                  onClick={() => setSelectedDoc(doc)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600">
                        <FileCheck size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {getDocumentTypeLabel(doc.document_type)}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Building2 size={14} className="mr-1" />
                          {doc.organization_name || "Organización"}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          Subido: {new Date(doc.uploaded_at).toLocaleDateString("es-ES")}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(doc.status)}
                  </div>
                </Card>
              ))}
            </div>

            {/* Document Preview & Actions */}
            {selectedDoc && (
              <Card className="sticky top-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Revisar Documento
                  </h3>
                  <button 
                    onClick={() => setSelectedDoc(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">Tipo de documento</p>
                    <p className="font-medium">{getDocumentTypeLabel(selectedDoc.document_type)}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">Organización</p>
                    <p className="font-medium">{selectedDoc.organization_name || "ID: " + selectedDoc.organization_id}</p>
                  </div>

                  {selectedDoc.cif && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500">CIF</p>
                      <p className="font-mono font-medium">{selectedDoc.cif}</p>
                    </div>
                  )}

                  {/* Document Preview */}
                  <div className="border rounded-lg p-4">
                    <a 
                      href={selectedDoc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center space-x-2 text-[#1F6357] hover:text-[#164a41] py-8"
                    >
                      <Eye size={24} />
                      <span className="font-medium">Ver documento completo</span>
                    </a>
                  </div>

                  {/* Rejection Reason */}
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      Motivo de rechazo (si aplica)
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Documento ilegible, información incorrecta, etc."
                      className="w-full border rounded-lg p-3 text-sm resize-none"
                      rows={3}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4 pt-4">
                    <Button
                      onClick={() => handleApprove(selectedDoc.id)}
                      disabled={processing}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center space-x-2"
                    >
                      <CheckCircle2 size={18} />
                      <span>Aprobar</span>
                    </Button>
                    <Button
                      onClick={() => handleReject(selectedDoc.id)}
                      disabled={processing}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white flex items-center justify-center space-x-2"
                    >
                      <XCircle size={18} />
                      <span>Rechazar</span>
                    </Button>
                  </div>

                  {processing && (
                    <div className="text-center text-sm text-gray-500">
                      Procesando...
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Info Card */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <div className="flex items-start space-x-4">
            <AlertTriangle className="text-blue-500 flex-shrink-0" size={24} />
            <div>
              <h4 className="font-semibold text-blue-800">Instrucciones de verificación</h4>
              <ul className="text-sm text-blue-700 mt-2 space-y-1">
                <li>• Verifica que el CIF sea válido y coincida con el nombre de la empresa</li>
                <li>• Comprueba que el documento sea legible y esté actualizado</li>
                <li>• Para DNI, verifica que corresponda al representante legal</li>
                <li>• Los documentos bancarios deben mostrar el IBAN completo</li>
              </ul>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
