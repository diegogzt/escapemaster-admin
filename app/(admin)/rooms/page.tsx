"use client";

import React, { useEffect, useState } from "react";
import { admin } from "@/services/api";
import { Card } from "@/components/Card";
import Link from "next/link";
import { Gamepad2, Users, Building2, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface Room {
  id: string;
  name: string;
  image_url?: string;
  is_active: boolean;
  verification_status: string;
  capacity_min: number;
  capacity: number;
  duration_minutes: number;
  price_per_person: number;
  organization_id?: string;
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<{ rooms: Room[]; total: number }>({ rooms: [], total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    admin
      .getRooms()
      .then((data) => setRooms(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const roomsList: Room[] = Array.isArray(rooms) ? rooms : rooms.rooms || [];

  const getStatusBadge = (room: Room) => {
    if (!room.is_active) {
      return (
        <span className="flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">
          <XCircle size={12} /> Inactiva
        </span>
      );
    }
    if (room.verification_status === "verified") {
      return (
        <span className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
          <CheckCircle size={12} /> Verificada
        </span>
      );
    }
    if (room.verification_status === "managed") {
      return (
        <span className="flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
          <CheckCircle size={12} /> Gestionada
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
        <AlertCircle size={12} /> Sin Verificar
      </span>
    );
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1F6357]">Salas de Escape</h1>
          <p className="text-[#2A7A6B]/80 mt-1">Gestiona los juegos y asignaciones</p>
        </div>
        <Link href="/rooms/create">
          <button className="bg-[#1F6357] hover:bg-[#164a41] text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
            <Gamepad2 size={18} />+ Nueva Sala
          </button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F6357]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roomsList.map((room) => (
            <Link key={room.id} href={`/rooms/${room.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-[#E8F5F3] rounded-lg flex items-center justify-center text-[#1F6357]">
                    {room.image_url ? (
                      <img src={room.image_url} alt={room.name} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Gamepad2 size={24} />
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">{getStatusBadge(room)}</div>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2">{room.name}</h3>
                <div className="flex items-center text-xs text-gray-500 mb-4 gap-2">
                  <span className="bg-gray-100 px-2 py-1 rounded flex items-center gap-1">
                    <Users size={12} /> {room.capacity_min}-{room.capacity}
                  </span>
                  <span className="bg-gray-100 px-2 py-1 rounded">{room.duration_minutes} min</span>
                  <span className="bg-gray-100 px-2 py-1 rounded">{room.price_per_person}€/p</span>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 text-sm">
                  {room.organization_id ? (
                    <div className="flex items-center text-[#1F6357]">
                      <Building2 size={16} className="mr-2" />
                      <span className="truncate">Organización Asignada</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-400 italic">
                      <Building2 size={16} className="mr-2" />
                      <span>Sin asignar</span>
                    </div>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
