"use client";

import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  QrCode,
  CheckCircle2,
  XCircle,
  Sparkles,
  WifiOff,
  History,
} from "lucide-react";
import {
  TicketData,
  VerificationResult,
  formatTokenWithDashes,
  generateTicketSignature,
  verifyByNumberAndTokenOffline,
  verifyQrPayloadOffline,
} from "@/lib/crypto";

interface ValidatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  secretKey: string;
  sampleTicket?: TicketData;
}

type ValidationMode = "TOKEN" | "QR_PASTE";

export default function ValidatorModal({
  isOpen,
  onClose,
  secretKey,
}: ValidatorModalProps) {
  const [mode, setMode] = useState<ValidationMode>("TOKEN");
  const [manualNumber, setManualNumber] = useState("0010");
  const [manualToken, setManualToken] = useState("");
  const [qrInput, setQrInput] = useState("");
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [history, setHistory] = useState<VerificationResult[]>([]);

  if (!isOpen) return null;

  const handleTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const verification = await verifyByNumberAndTokenOffline(
      manualNumber,
      manualToken,
      secretKey
    );
    setResult(verification);
    setHistory((prev) => [verification, ...prev.slice(0, 9)]);
  };

  const handleQrPasteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrInput.trim()) return;
    const verification = await verifyQrPayloadOffline(qrInput, secretKey);
    setResult(verification);
    setHistory((prev) => [verification, ...prev.slice(0, 9)]);
  };

  // Botón de demostración: Simula el boleto #0010 auténtico
  const handleSimulateAuthenticWinner = async () => {
    const num = "0010";
    const realSig = await generateTicketSignature(num, secretKey);
    const formatted = formatTokenWithDashes(realSig);
    setManualNumber(num);
    setManualToken(formatted);
    const verification = await verifyByNumberAndTokenOffline(num, formatted, secretKey);
    setResult(verification);
    setHistory((prev) => [verification, ...prev.slice(0, 9)]);
  };

  // Botón de demostración: Simula alguien que editó con IA su boleto para ponerle #0010 pero tiene otro token
  const handleSimulateAiForgery = async () => {
    const num = "0010";
    const fakeToken = "9F4A-88C1-20B7"; // Token inventado o perteneciente a otro boleto
    setManualNumber(num);
    setManualToken(fakeToken);
    const verification = await verifyByNumberAndTokenOffline(num, fakeToken, secretKey);
    setResult(verification);
    setHistory((prev) => [verification, ...prev.slice(0, 9)]);
  };

  return (
    <div className="no-print fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-neutral-950 text-white border-2 border-amber-400 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden my-8">
        {/* Cabecera del Modal */}
        <div className="bg-neutral-900 px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black uppercase tracking-tight">
                  Verificador de Autenticidad (N° + Token)
                </h2>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <WifiOff className="w-3 h-3" />
                  100% Offline
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Protección contra boletos clonados o editados con IA mediante firma HMAC-SHA256
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Selector de pestaña (N° + Token principal vs Pegar QR) */}
          <div className="grid grid-cols-2 gap-2 bg-neutral-900 p-1.5 rounded-xl border border-neutral-800">
            <button
              type="button"
              onClick={() => setMode("TOKEN")}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                mode === "TOKEN"
                  ? "bg-amber-400 text-neutral-950 shadow-xs"
                  : "text-neutral-300 hover:bg-neutral-800"
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Verificar por N° de Boleto + Token de Firma</span>
            </button>

            <button
              type="button"
              onClick={() => setMode("QR_PASTE")}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                mode === "QR_PASTE"
                  ? "bg-amber-400 text-neutral-950 shadow-xs"
                  : "text-neutral-300 hover:bg-neutral-800"
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>Verificar por Lectura QR</span>
            </button>
          </div>

          {/* MODO 1 (PRINCIPAL): VERIFICAR POR NÚMERO DE BOLETO + TOKEN DE FIRMA */}
          {mode === "TOKEN" && (
            <form onSubmit={handleTokenSubmit} className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-neutral-300">
                  Ingresa el <strong className="text-amber-300">N° de Boleto ganador</strong> y el{" "}
                  <strong className="text-amber-300">TOKEN DE FIRMA</strong> impreso en el boleto:
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSimulateAuthenticWinner}
                    className="text-[11px] font-bold px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 transition cursor-pointer flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    Probar #0010 Auténtico
                  </button>
                  <button
                    type="button"
                    onClick={handleSimulateAiForgery}
                    className="text-[11px] font-bold px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30 transition cursor-pointer"
                  >
                    Simular #0010 Falsificado con IA
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-4">
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    N° de Boleto (Ej: 0010)
                  </label>
                  <input
                    type="text"
                    value={manualNumber}
                    onChange={(e) => setManualNumber(e.target.value)}
                    placeholder="0010"
                    className="w-full bg-neutral-900 border border-neutral-700 focus:border-amber-400 focus:outline-none rounded-xl px-3.5 py-2.5 text-base font-mono font-bold text-amber-300"
                  />
                </div>

                <div className="sm:col-span-5">
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Token de Firma (12 letras/números)
                  </label>
                  <input
                    type="text"
                    value={manualToken}
                    onChange={(e) => setManualToken(e.target.value.toUpperCase())}
                    placeholder="Ej: A8F9-3C12-E4B0"
                    className="w-full bg-neutral-900 border border-neutral-700 focus:border-amber-400 focus:outline-none rounded-xl px-3.5 py-2.5 text-base font-mono font-bold text-white uppercase"
                  />
                </div>

                <div className="sm:col-span-3">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black text-sm transition cursor-pointer shadow-md"
                  >
                    Verificar Token
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-neutral-400">
                Nota: No importa si escribes el token con o sin guiones (ej.{" "}
                <code className="text-neutral-300">A8F9-3C12-E4B0</code> o{" "}
                <code className="text-neutral-300">A8F93C12E4B0</code>).
              </p>
            </form>
          )}

          {/* MODO 2: PEGAR TEXTO DE LECTORA QR */}
          {mode === "QR_PASTE" && (
            <form onSubmit={handleQrPasteSubmit} className="space-y-3">
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider">
                Contenido del Código QR Escaneado
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={qrInput}
                  onChange={(e) => setQrInput(e.target.value)}
                  placeholder="Ej: numero:0010|sig:A8F93C12E4B0"
                  className="flex-1 bg-neutral-900 border border-neutral-700 focus:border-amber-400 focus:outline-none rounded-xl px-4 py-2.5 text-sm font-mono text-white"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black text-sm transition cursor-pointer shrink-0"
                >
                  Verificar QR
                </button>
              </div>
            </form>
          )}

          {/* RESULTADO DE LA VERIFICACIÓN CRIPTOGRÁFICA */}
          {result && (
            <div
              className={`p-5 rounded-2xl border-2 transition-all ${
                result.isValid
                  ? "bg-emerald-950/60 border-emerald-500 text-emerald-100"
                  : "bg-rose-950/60 border-rose-500 text-rose-100"
              }`}
            >
              <div className="flex items-start gap-3.5">
                {result.isValid ? (
                  <CheckCircle2 className="w-9 h-9 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <ShieldAlert className="w-9 h-9 text-rose-400 shrink-0 mt-0.5" />
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span
                      className={`text-sm sm:text-base font-black uppercase tracking-wide ${
                        result.isValid ? "text-emerald-300" : "text-rose-300"
                      }`}
                    >
                      {result.isValid
                        ? "BOLETO AUTÉNTICO Y VÁLIDO"
                        : "BOLETO FALSIFICADO / NO AUTORIZADO"}
                    </span>
                    <span className="text-[11px] font-mono opacity-75">
                      Verificado a las {result.verifiedAt}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm mt-1 font-medium leading-relaxed">
                    {result.message}
                  </p>

                  {result.ticketNumber && (
                    <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                      <div className="bg-black/30 px-3 py-1.5 rounded-lg">
                        <span className="block text-[10px] uppercase text-neutral-400">
                          Boleto N°
                        </span>
                        <strong className="text-amber-300 text-sm">
                          #{result.ticketNumber}
                        </strong>
                      </div>
                      <div className="bg-black/30 px-3 py-1.5 rounded-lg">
                        <span className="block text-[10px] uppercase text-neutral-400">
                          Token Ingresado
                        </span>
                        <strong className="text-white truncate block">
                          {result.providedSignature || "—"}
                        </strong>
                      </div>
                      <div className="bg-black/30 px-3 py-1.5 rounded-lg">
                        <span className="block text-[10px] uppercase text-neutral-400">
                          Verificación HMAC
                        </span>
                        <strong
                          className={
                            result.isValid ? "text-emerald-400" : "text-rose-400"
                          }
                        >
                          {result.isValid ? "COINCIDE 100%" : "NO COINCIDE"}
                        </strong>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Historial rápido de boletos verificados en esta sesión */}
          {history.length > 0 && (
            <div className="pt-2 border-t border-neutral-800">
              <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-400 mb-2">
                <History className="w-3.5 h-3.5" />
                <span>Últimas verificaciones en esta sesión</span>
              </div>
              <div className="max-h-28 overflow-y-auto space-y-1 pr-1">
                {history.map((item, idx) => (
                  <div
                    key={`${item.verifiedAt}-${idx}`}
                    className="flex items-center justify-between text-xs px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800"
                  >
                    <div className="flex items-center gap-2">
                      {item.isValid ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-400" />
                      )}
                      <span className="font-mono font-bold text-white">
                        {item.ticketNumber ? `#${item.ticketNumber}` : "Formato inválido"}
                      </span>
                      <span className="font-mono text-neutral-400">
                        ({item.providedSignature || "sin token"})
                      </span>
                      <span
                        className={`text-[11px] font-bold ${
                          item.isValid ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {item.isValid ? "AUTÉNTICO" : "FALSIFICADO"}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-neutral-500">
                      {item.verifiedAt}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
