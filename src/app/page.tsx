"use client";

import React, { useState, useEffect, useCallback } from "react";
import { DEFAULT_RAFFLE_CONFIG, RaffleConfig } from "@/config/raffleConfig";
import { TicketData, generateSignedTicketsBatch } from "@/lib/crypto";
import ControlPanel from "@/components/ControlPanel";
import A4PrintSheet from "@/components/A4PrintSheet";
import ValidatorModal from "@/components/ValidatorModal";
import { Scissors, ShieldCheck } from "lucide-react";

export default function HomePage() {
  const [config, setConfig] = useState<RaffleConfig>(DEFAULT_RAFFLE_CONFIG);
  const [ticketCountInput, setTicketCountInput] = useState<number>(
    DEFAULT_RAFFLE_CONFIG.defaultTicketCount
  );
  const [startNumberInput, setStartNumberInput] = useState<number>(1);
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(true);
  const [isValidatorOpen, setIsValidatorOpen] = useState<boolean>(false);

  const handleGenerateTickets = useCallback(async () => {
    setIsGenerating(true);
    try {
      const batch = await generateSignedTicketsBatch(
        ticketCountInput,
        config.secretKey,
        startNumberInput
      );
      setTickets(batch);
    } finally {
      setIsGenerating(false);
    }
  }, [ticketCountInput, config.secretKey, startNumberInput]);

  // Generar los 300 boletos por defecto al iniciar
  useEffect(() => {
    handleGenerateTickets();
  }, [handleGenerateTickets]);

  const handleConfigChange = (updated: Partial<RaffleConfig>) => {
    setConfig((prev) => ({ ...prev, ...updated }));
  };

  const handlePrint = () => {
    window.print();
  };

  const totalPages = Math.ceil(tickets.length / 8) || 1;

  return (
    <div className="min-h-screen flex flex-col bg-neutral-900">
      {/* 1. Panel Superior de Configuración y Controles (Oculto al imprimir) */}
      <ControlPanel
        config={config}
        ticketCountInput={ticketCountInput}
        startNumberInput={startNumberInput}
        totalGenerated={tickets.length}
        totalPages={totalPages}
        isGenerating={isGenerating}
        onTicketCountChange={setTicketCountInput}
        onStartNumberChange={setStartNumberInput}
        onConfigChange={handleConfigChange}
        onGenerateTickets={handleGenerateTickets}
        onPrint={handlePrint}
        onOpenValidator={() => setIsValidatorOpen(true)}
      />

      {/* Banner informativo rápido sobre el boleto doble y el token antifraude */}
      <div className="no-print max-w-7xl mx-auto w-full px-4 sm:px-6 pt-4">
        <div className="bg-neutral-800/90 border border-neutral-700 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-neutral-300">
          <div className="flex items-start sm:items-center gap-2.5">
            <Scissors className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
            <span>
              <strong className="text-white">Diseño en 2 Partes (8 boletos por hoja A4):</strong>{" "}
              A la izquierda está el{" "}
              <strong className="text-amber-300">Talón de Control / Urna</strong> (que se recorta
              con tijera y queda en la ferretería) y a la derecha el{" "}
              <strong className="text-amber-300">Boleto del Cliente</strong>. Ambos llevan el{" "}
              <strong className="text-white">N° de Boleto y el Token de Firma único</strong>.
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-semibold shrink-0">
            <ShieldCheck className="w-4 h-4" />
            <span>
              Ej. #0001 → Token: {tickets[0]?.formattedSignature}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Vista Previa e Impresión en Hojas A4 (8 boletos dobles por hoja) */}
      <main className="flex-1 overflow-x-auto">
        {isGenerating && tickets.length === 0 ? (
          <div className="no-print flex flex-col items-center justify-center py-24 text-neutral-300 gap-3">
            <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-bold">
              Generando y firmando criptográficamente {ticketCountInput} boletos...
            </p>
          </div>
        ) : (
          <A4PrintSheet tickets={tickets} config={config} />
        )}
      </main>

      {/* 3. Modal de Validación Antifraude Offline */}
      <ValidatorModal
        isOpen={isValidatorOpen}
        onClose={() => setIsValidatorOpen(false)}
        secretKey={config.secretKey}
        sampleTicket={tickets[0]}
      />
    </div>
  );
}
