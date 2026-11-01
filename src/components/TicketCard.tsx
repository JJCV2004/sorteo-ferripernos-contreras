"use client";

import React from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  Scissors,
  KeyRound,
} from "lucide-react";
import { RaffleConfig } from "@/config/raffleConfig";
import { TicketData } from "@/lib/crypto";

interface TicketCardProps {
  ticket: TicketData;
  config: RaffleConfig;
}

export default function TicketCard({ ticket, config }: TicketCardProps) {
  return (
    <div
      className="ticket-card relative bg-white text-neutral-900 border border-dashed border-neutral-400 select-none overflow-hidden flex flex-row"
      style={{
        width: "96mm",
        height: "64mm",
        boxSizing: "border-box",
      }}
    >
      {/* Marcas sutiles de esquina exterior para corte de cada boleto */}
      <span className="pointer-events-none absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-neutral-600" />
      <span className="pointer-events-none absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-neutral-600" />
      <span className="pointer-events-none absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-neutral-600" />
      <span className="pointer-events-none absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-neutral-600" />

      {/* =====================================================================
          PARTE 1 (IZQUIERDA): TALÓN RECORTABLE PARA LA FERRETERÍA / TÓMBOLA
          Contiene el Número del Boleto y el Token de Firma para verificar
          ===================================================================== */}
      <div
        className="h-full bg-amber-50/60 flex flex-col justify-between relative shrink-0"
        style={{
          width: "33mm",
          padding: "2.5mm 2.2mm",
        }}
      >
        {/* Cabecera del Talón */}
        <div className="border-b border-neutral-800 pb-1 text-center">
          <span className="block text-[6px] font-black uppercase tracking-widest bg-neutral-900 text-amber-400 py-0.5 px-1 rounded-xs">
            TALÓN CONTROL / URNA
          </span>
          <span className="block text-[6.5px] font-extrabold uppercase text-neutral-800 mt-0.5 truncate">
            {config.companyName}
          </span>
        </div>

        {/* Número del Boleto grande en el Talón */}
        <div className="my-0.5 bg-amber-400 border border-neutral-900 rounded px-1.5 py-1 text-center shadow-2xs">
          <span className="block text-[5.5px] font-extrabold uppercase tracking-wider text-neutral-900">
            N° DE BOLETO
          </span>
          <span className="block font-mono text-[14px] font-black leading-none text-neutral-950 tracking-tight mt-0.5">
            #{ticket.formattedNumber}
          </span>
        </div>

        {/* Token de Firma Criptográfica en el Talón (Clave Antifraude) */}
        <div className="bg-white border border-neutral-900 rounded p-1 text-center">
          <div className="flex items-center justify-center gap-0.5 text-[5.5px] font-black uppercase text-neutral-700">
            <KeyRound className="w-2.5 h-2.5 text-amber-600 shrink-0" />
            <span>TOKEN DE FIRMA</span>
          </div>
          <span className="block font-mono text-[7.5px] font-black text-neutral-950 tracking-tighter bg-neutral-100 rounded-xs py-0.5 mt-0.5 border border-neutral-300">
            {ticket.formattedSignature}
          </span>
        </div>

        {/* Líneas opcionales de control de participante en urna */}
        <div className="space-y-1.5 pt-0.5 text-[5.8px] text-neutral-700 font-semibold">
          <div className="border-b border-dotted border-neutral-500 pb-0.5">
            <span>Nombre:</span>
          </div>
          <div className="border-b border-dotted border-neutral-500 pb-0.5">
            <span>Tel:</span>
          </div>
          <div className="border-b border-dotted border-neutral-500 pb-0.5">
             <span>Cedula:</span>
          </div>
        </div>


      </div>

      {/* =====================================================================
          LÍNEA DIVISORIA VERTICAL DE CORTE CON TIJERA (TALÓN vs CLIENTE)
          ===================================================================== */}
      <div className="relative h-full w-0 border-l-2 border-dashed border-neutral-500 flex flex-col items-center justify-between py-2 shrink-0">
        <div className="bg-white px-0.5 -ml-[7px] text-neutral-700 rotate-90">
          <Scissors className="w-3 h-3" />
        </div>
        <div className="bg-white px-0.5 -ml-[7px] text-neutral-700 -rotate-90">
          <Scissors className="w-3 h-3" />
        </div>
      </div>

      {/* =====================================================================
          PARTE 2 (DERECHA): COMPROBANTE DEL PARTICIPANTE (CLIENTE)
          ===================================================================== */}
      <div
        className="relative flex-1 h-full flex flex-col justify-between min-w-0 bg-white"
        style={{
          padding: "2mm 2.6mm",
        }}
      >
        {/* 1. CABECERA DERECHA: Logo Oficial (/LoGO.png) + Título + Badge Boleto N° */}
        <div className="flex items-center justify-between gap-1 border-b border-neutral-800 pb-1 shrink-0">
          <div className="flex items-center gap-1.5 min-w-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={config.logoUrl || "/LoGO.png"}
              alt={config.companyName}
              className="h-8 w-auto max-w-[22mm] object-contain shrink-0"
            />
            <div className="min-w-0 leading-tight">
              <h2 className="text-[8px] font-black tracking-tight uppercase text-neutral-900 truncate">
                {config.companyName}
              </h2>
              <p className="text-[5.4px] font-bold text-neutral-600 uppercase truncate">
                COMPROBANTE DEL PARTICIPANTE
              </p>
            </div>
          </div>

          {/* Badge amarillo de BOLETO N° #0001 */}
          <div className="shrink-0 bg-amber-400 text-neutral-950 border border-neutral-900 px-1.5 py-0.5 rounded text-right leading-none">
            <span className="block text-[4.8px] font-bold uppercase text-neutral-800">
              BOLETO N°
            </span>
            <span className="font-mono text-[10.5px] font-black tracking-tight">
              #{ticket.formattedNumber}
            </span>
          </div>
        </div>

        {/* 2. CUERPO CENTRAL DERECHO (Pegado a la línea divisoria superior) */}
        <div className="flex items-start justify-between gap-1.5 mt-1 mb-auto relative z-20">
          {/* Columna Izquierda del Cuerpo (Arriba): Banner + Fecha/Hora + Contacto */}
          <div className="flex-1 min-w-0 space-y-1">
            {/* Banner oscuro compacto */}
            <div className="bg-neutral-900 text-white px-1.5 py-0.5 rounded-xs border-l-3 border-amber-400">
              <p className="text-[7.5px] font-extrabold uppercase leading-tight text-amber-300 truncate">
                {config.eventTitle}
              </p>
              <p className="text-[5.8px] font-medium text-white leading-tight truncate">
                {config.prizeHighlight}
              </p>
            </div>

            {/* Píldora gris claro con Fecha y Hora */}
            <div className="grid grid-cols-2 gap-1 text-[6px] text-neutral-800 bg-neutral-100 px-1.5 py-0.5 rounded-xs border border-neutral-300">
              <div className="flex items-center gap-0.5 truncate">
                <Calendar className="w-2.5 h-2.5 text-amber-600 shrink-0" />
                <span className="font-bold truncate">{config.drawDate}</span>
              </div>
              <div className="flex items-center gap-0.5 truncate">
                <Clock className="w-2.5 h-2.5 text-amber-600 shrink-0" />
                <span className="font-bold truncate">{config.drawTime}</span>
              </div>
            </div>

            {/* Dirección y Teléfono alineados a la izquierda con gap compacto */}
            <div className="space-y-0.5 text-[5.8px] text-neutral-800 leading-tight pt-0.5 pr-12">
              <div className="flex items-center gap-0.5">
                <MapPin className="w-2.5 h-2.5 text-neutral-900 shrink-0" />
                <span className="font-medium truncate">{config.address}</span>
              </div>
            </div>

            {/* Caja compacta informativa: Condición de Participación + Detalles del Premio */}
            <div className="max-w-[33mm] bg-amber-50/90 border border-amber-400 rounded-xs p-1 space-y-0.5 shadow-2xs">
              <div className="inline-block bg-amber-400 text-neutral-950 px-1 py-[0.5px] rounded-[2px] text-[4.8px] font-black uppercase tracking-wider leading-none">
                ★ CONDICIÓN DE PARTICIPACIÓN
              </div>
              <p className="text-[5.4px] font-extrabold text-neutral-900 leading-[1.15]">
                Por su compra de <span className="underline decoration-amber-500">$20 en adelante</span> obtienes 1 boleto participante.
              </p>
              <ul className="text-[4.9px] font-semibold text-neutral-700 leading-[1.15] space-y-[0.5px] pt-[0.5px] border-t border-amber-300/80">
                <li className="truncate">• Mochila Stanley con organizador extraíble</li>
                <li className="truncate">• Resistente al agua / base reforzada &quot;</li>
                <li className="truncate">• Tela de alta resistencia 600D &quot;</li>
              </ul>
            </div>
          </div>

          {/* Columna Derecha del Cuerpo (Arriba): QR alineado al borde superior del banner */}
          <div className="shrink-0 flex flex-col items-center justify-center bg-white border border-neutral-300 rounded p-1">
            <QRCodeSVG
              value={ticket.qrPayload}
              size={44}
              level="M"
              marginSize={0}
              bgColor="#FFFFFF"
              fgColor="#111111"
            />
            <span className="text-[4.5px] font-bold uppercase text-neutral-500 mt-0.5 leading-none">
              QR CONTROL
            </span>
          </div>
        </div>

        {/* 3. IMAGEN DEL PREMIO (/mochila.png) EN EL ESPACIO INFERIOR CENTRAL/DERECHA */}
        {(config.prizeImageUrl || "/mochila.png") && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
              src={config.prizeImageUrl || "/mochila.png"}
              alt="Premio Mochila Stanley"
              className="pointer-events-none absolute bottom-7 right-[8%] w-24 h-24 max-h-[26mm] object-contain drop-shadow-md z-10"
          />
        )}

        {/* 4. BARRA INFERIOR DE TOKEN DE FIRMA Y CONDICIONES */}
        <div className="relative z-20 space-y-0.5 shrink-0">
          <div className="bg-neutral-100 border border-neutral-800 rounded px-1.5 py-0.5 flex items-center justify-between gap-1">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-amber-600 shrink-0" />
              <span className="text-[5.6px] font-black uppercase text-neutral-800">
                TOKEN DE FIRMA:
              </span>
            </div>
            <span className="font-mono text-[7.8px] font-black tracking-tight text-neutral-950">
              {ticket.formattedSignature}
            </span>
          </div>

          <div className="border-t border-neutral-300 pt-0.5 flex items-center justify-between gap-1 text-[5.1px] text-neutral-600 leading-none">
            <span className="truncate font-medium">{config.terms}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
