"use client";

import React, { useState } from "react";
import {
  Printer,
  RefreshCw,
  ShieldCheck,
  Settings2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  KeyRound,
  Scissors,
} from "lucide-react";
import { RaffleConfig } from "@/config/raffleConfig";

interface ControlPanelProps {
  config: RaffleConfig;
  ticketCountInput: number;
  startNumberInput: number;
  totalGenerated: number;
  totalPages: number;
  isGenerating: boolean;
  onTicketCountChange: (count: number) => void;
  onStartNumberChange: (start: number) => void;
  onConfigChange: (updated: Partial<RaffleConfig>) => void;
  onGenerateTickets: () => void;
  onPrint: () => void;
  onOpenValidator: () => void;
}

const PRESET_COUNTS = [40, 80, 160, 300, 500];

export default function ControlPanel({
  config,
  ticketCountInput,
  startNumberInput,
  totalGenerated,
  totalPages,
  isGenerating,
  onTicketCountChange,
  onStartNumberChange,
  onConfigChange,
  onGenerateTickets,
  onPrint,
  onOpenValidator,
}: ControlPanelProps) {
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);

  return (
    <header className="no-print sticky top-0 z-30 bg-neutral-950 text-white border-b-4 border-amber-400 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        {/* Fila Principal: Identidad + Controles Rápidos + Acciones */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Identidad de la App con el Logo Oficial /LoGO.png */}
          <div className="flex items-center gap-3">
            <div className="h-11 px-2.5 rounded-lg bg-white border border-amber-400 flex items-center justify-center shadow-md shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={config.logoUrl || "/LoGO.png"}
                alt={config.companyName}
                className="h-9 w-auto object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-white uppercase">
                  {config.companyName}
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30">
                  <Scissors className="w-3.5 h-3.5" />
                  Boleto Doble (Talón + Cliente)
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                8 Boletos por Hoja A4 •{" "}
                <span className="text-amber-300 font-semibold">{config.eventTitle}</span>
              </p>
            </div>
          </div>

          {/* Controles de Cantidad y Botones Principales */}
          <div className="flex flex-wrap items-end gap-3">
            {/* Selector numérico de cantidad de boletos */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-2 flex flex-col gap-1.5">
              <label
                htmlFor="ticket-count-input"
                className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 flex items-center justify-between gap-2"
              >
                <span>Cantidad de Boletos</span>
                <span className="text-amber-400 font-mono">
                  {totalPages} hojas A4 (8/hoja)
                </span>
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  id="ticket-count-input"
                  type="number"
                  min={1}
                  max={5000}
                  value={ticketCountInput}
                  onChange={(e) => {
                    const val = Math.max(1, Math.min(5000, Number(e.target.value) || 1));
                    onTicketCountChange(val);
                  }}
                  className="w-24 bg-neutral-950 border border-neutral-700 focus:border-amber-400 focus:outline-none rounded px-2.5 py-1.5 text-sm font-mono font-bold text-white"
                />
                {/* Botones rápidos de cantidad */}
                <div className="flex items-center gap-1">
                  {PRESET_COUNTS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => onTicketCountChange(preset)}
                      className={`px-2 py-1.5 text-xs font-bold rounded transition cursor-pointer ${
                        ticketCountInput === preset
                          ? "bg-amber-400 text-neutral-950 shadow-xs"
                          : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Botón Generar Boletos */}
            <button
              type="button"
              onClick={onGenerateTickets}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-neutral-950 font-extrabold text-sm shadow-md transition cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`} />
              <span>{isGenerating ? "Firmando..." : "Generar Boletos"}</span>
            </button>

            {/* Botón Imprimir / Guardar como PDF */}
            <button
              type="button"
              onClick={onPrint}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white hover:bg-neutral-100 text-neutral-950 font-extrabold text-sm shadow-md transition cursor-pointer"
            >
              <Printer className="w-4 h-4 text-neutral-900" />
              <span>Imprimir / Guardar PDF</span>
            </button>

            {/* Botón Validador Antifraude por N° y Token */}
            <button
              type="button"
              onClick={onOpenValidator}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-extrabold text-sm shadow-md transition cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verificar Boleto y Token</span>
            </button>
          </div>
        </div>

        {/* Barra Secundaria: Estado actual + Botón para desplegar edición de Placeholders */}
        <div className="mt-3 pt-2.5 border-t border-neutral-800/90 flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-400">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>
              Mostrando:{" "}
              <strong className="text-white font-mono">{totalGenerated} boletos</strong> (desde{" "}
              <strong className="text-amber-300 font-mono">
                #{String(startNumberInput).padStart(4, "0")}
              </strong>{" "}
              hasta{" "}
              <strong className="text-amber-300 font-mono">
                #{String(startNumberInput + totalGenerated - 1).padStart(4, "0")}
              </strong>
              )
            </span>
            <span>•</span>
            <span>
              Total páginas A4: <strong className="text-white font-mono">{totalPages}</strong> (8
              boletos dobles por hoja: Talón Urna + Comprobante Cliente)
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowTemplateEditor((prev) => !prev)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition cursor-pointer"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>
              {showTemplateEditor
                ? "Ocultar configuración de textos, imágenes y clave secreta"
                : "Editar textos del boleto, imágenes, fecha y clave secreta"}
            </span>
            {showTemplateEditor ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Panel desplegable de edición en vivo */}
        {showTemplateEditor && (
          <div className="mt-3 p-4 rounded-xl bg-neutral-900 border border-neutral-800 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block font-bold text-neutral-300 mb-1">
                Nombre del Evento
              </label>
              <input
                type="text"
                value={config.eventTitle}
                onChange={(e) => onConfigChange({ eventTitle: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-700 rounded px-2.5 py-1.5 text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-300 mb-1">
                Detalle del Premio
              </label>
              <input
                type="text"
                value={config.prizeHighlight}
                onChange={(e) => onConfigChange({ prizeHighlight: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-700 rounded px-2.5 py-1.5 text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-300 mb-1">
                Fecha del Sorteo
              </label>
              <input
                type="text"
                value={config.drawDate}
                onChange={(e) => onConfigChange({ drawDate: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-700 rounded px-2.5 py-1.5 text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-300 mb-1">
                Hora del Sorteo
              </label>
              <input
                type="text"
                value={config.drawTime}
                onChange={(e) => onConfigChange({ drawTime: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-700 rounded px-2.5 py-1.5 text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-300 mb-1">
                Dirección Ferretería
              </label>
              <input
                type="text"
                value={config.address}
                onChange={(e) => onConfigChange({ address: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-700 rounded px-2.5 py-1.5 text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-300 mb-1">
                Teléfono / WhatsApp
              </label>
              <input
                type="text"
                value={config.phone}
                onChange={(e) => onConfigChange({ phone: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-700 rounded px-2.5 py-1.5 text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-300 mb-1">
                Ruta del Logo Oficial (public/)
              </label>
              <input
                type="text"
                placeholder="/LoGO.png"
                value={config.logoUrl}
                onChange={(e) => onConfigChange({ logoUrl: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-700 rounded px-2.5 py-1.5 text-white font-mono focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-300 mb-1">
                Ruta Imagen del Premio (public/)
              </label>
              <input
                type="text"
                placeholder="/mochila.png"
                value={config.prizeImageUrl}
                onChange={(e) => onConfigChange({ prizeImageUrl: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-700 rounded px-2.5 py-1.5 text-white font-mono focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-300 mb-1">
                N° Correlativo Inicial (Ej. 1 → #0001)
              </label>
              <input
                type="number"
                min={1}
                value={startNumberInput}
                onChange={(e) =>
                  onStartNumberChange(Math.max(1, Number(e.target.value) || 1))
                }
                className="w-full bg-neutral-950 border border-neutral-700 rounded px-2.5 py-1.5 text-white font-mono focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="md:col-span-1">
              <label className="block font-bold text-neutral-300 mb-1">
                Condiciones Básicas al Pie
              </label>
              <input
                type="text"
                value={config.terms}
                onChange={(e) => onConfigChange({ terms: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-700 rounded px-2.5 py-1.5 text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-1 font-bold text-amber-400 mb-1">
                <KeyRound className="w-3.5 h-3.5" />
                <span>Clave Secreta Criptográfica (HMAC-SHA256 Offline)</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={config.secretKey}
                  onChange={(e) => onConfigChange({ secretKey: e.target.value })}
                  className="flex-1 bg-neutral-950 border border-amber-500/50 rounded px-2.5 py-1.5 text-amber-300 font-mono focus:border-amber-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={onGenerateTickets}
                  className="px-3 py-1.5 rounded bg-amber-400 text-neutral-950 font-bold hover:bg-amber-300 transition flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Re-firmar</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
