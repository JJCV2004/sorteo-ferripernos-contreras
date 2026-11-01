"use client";

import React from "react";
import { RaffleConfig } from "@/config/raffleConfig";
import { TicketData } from "@/lib/crypto";
import TicketCard from "./TicketCard";
import { Scissors } from "lucide-react";

interface A4PrintSheetProps {
  tickets: TicketData[];
  config: RaffleConfig;
}

export default function A4PrintSheet({ tickets, config }: A4PrintSheetProps) {
  const perPage = 8; // 8 boletos dobles (Talón + Cliente) por hoja A4
  const pages: TicketData[][] = [];

  for (let i = 0; i < tickets.length; i += perPage) {
    pages.push(tickets.slice(i, i + perPage));
  }

  return (
    <div className="print-sheets-container flex flex-col items-center gap-8 py-6 px-4">
      {pages.map((pageTickets, pageIndex) => {
        const firstTicket = pageTickets[0]?.formattedNumber ?? "0001";
        const lastTicket =
          pageTickets[pageTickets.length - 1]?.formattedNumber ?? firstTicket;

        return (
          <section
            key={`a4-page-${pageIndex + 1}`}
            className="a4-sheet bg-white shadow-2xl border border-neutral-300 flex flex-col items-center justify-between relative"
          >
            {/* Cabecera sutil de hoja A4 (guía de corte e identificación de lote) */}
            <div className="w-full flex items-center justify-between text-[9px] text-neutral-600 border-b border-neutral-200 pb-1 px-1">
              <span className="font-bold uppercase tracking-wider text-neutral-800">
                {config.companyName} — {config.eventTitle}
              </span>
              <span className="inline-flex items-center gap-1 font-semibold text-neutral-600">
                <Scissors className="w-2.5 h-2.5" />8 Boletos Dobles (Talón Urna + Boleto Cliente) •
                Cortar con tijera por línea punteada
              </span>
              <span className="font-mono font-bold text-neutral-800">
                Hoja {pageIndex + 1}/{pages.length} (#{firstTicket} - #{lastTicket})
              </span>
            </div>

            {/* Cuadrícula de 8 Boletos por Hoja A4: 2 Columnas x 4 Filas */}
            <div
              className="ticket-grid grid grid-cols-2 place-items-center my-auto"
              style={{
                columnGap: "3mm",
                rowGap: "3.5mm",
              }}
            >
              {pageTickets.map((ticket) => (
                <TicketCard
                  key={ticket.formattedNumber}
                  ticket={ticket}
                  config={config}
                />
              ))}
            </div>

            {/* Pie de hoja A4 */}
            <div className="w-full flex items-center justify-between text-[8px] text-neutral-400 border-t border-neutral-200 pt-1 px-1">
              <span>
                Seguridad Antifraude Offline HMAC-SHA256 (N° de Boleto + Token de Firma Único)
              </span>
              <span>
                Formato Hoja A4 (210mm × 297mm) — 8 Boletos por página — Escala de impresión: 100%
              </span>
            </div>
          </section>
        );
      })}
    </div>
  );
}
