/**
 * ============================================================================
 * CONFIGURACIÓN CENTRAL Y PLACEHOLDERS - FERRIPERNOS CONTRERAS
 * ============================================================================
 * Edita los valores de este archivo para actualizar de forma permanente:
 *  1. El logo oficial de la ferretería (/LoGO.png) y la imagen del premio (/mochila.png)
 *  2. La clave secreta criptográfica (HMAC-SHA256)
 *  3. La fecha y hora exacta del sorteo
 *  4. La dirección, teléfono y condiciones impresas en cada boleto
 */

export interface RaffleConfig {
  /** Nombre comercial de la ferretería */
  companyName: string;
  /** Rubro o subtítulo de la empresa */
  companyTagline: string;
  /**
   * Ruta de la imagen del logo oficial dentro de la carpeta public/ (ej: "/LoGO.png").
   */
  logoUrl: string;
  /**
   * Ruta de la imagen del premio dentro de la carpeta public/ (ej: "/mochila.png").
   */
  prizeImageUrl: string;
  /** Título principal del sorteo */
  eventTitle: string;
  /** Premio destacado */
  prizeHighlight: string;
  /**
   * [PLACEHOLDER FECHA EXACTA]: Reemplazar cuando se defina el día exacto de diciembre
   */
  drawDate: string;
  /**
   * [PLACEHOLDER HORA EXACTA]: Reemplazar con la hora oficial del sorteo
   */
  drawTime: string;
  /**
   * [PLACEHOLDER DIRECCIÓN]: Dirección física del local de Ferripernos Contreras
   */
  address: string;
  /**
   * [PLACEHOLDER TELÉFONO / WHATSAPP]: Contacto de la ferretería
   */
  phone: string;
  /**
   * [PLACEHOLDER CONDICIONES]: Texto legal/condiciones al pie del boleto
   */
  terms: string;
  /**
   * [CLAVE SECRETA CRIPTOGRÁFICA INTERNA]
   * IMPORTANTE: Esta clave firma todos los boletos con HMAC-SHA256.
   * No la compartas públicamente. Debe ser la misma al imprimir y el día del sorteo.
   */
  secretKey: string;
  /** Cantidad de boletos por defecto al abrir la app */
  defaultTicketCount: number;
  /** Cantidad fija de boletos por hoja A4: 8 boletos dobles (con talón recortable) por página */
  ticketsPerPage: 8;
}

export const DEFAULT_RAFFLE_CONFIG: RaffleConfig = {
  companyName: "FERRIPERNOS CONTRERAS",
  companyTagline: "Pernos • Herramientas • Ferretería Industrial",

  // >>> IMÁGENES OFICIALES EN LA CARPETA public/ <<<
  logoUrl: "/LoGO.png",
  prizeImageUrl: "/mochila.png",

  // >>> TEXTOS FINALES DEL EVENTO <<<
  eventTitle: "GRAN SORTEO NAVIDEÑO",
  prizeHighlight: "Premio: 1 Mochila para Herramientas Stanley",
  drawDate: "22 de Diciembre, 2026", // <-- [PLACEHOLDER] Fecha del sorteo
  drawTime: "17:00 hrs", // <-- [PLACEHOLDER] Hora del sorteo

  // >>> DIRECCIÓN Y TELÉFONO DE LA FERRETERÍA <<<
  address: "Av. 5 de Agosto", // <-- [PLACEHOLDER] Dirección
  phone: "+56 9 8765 4321", // <-- [PLACEHOLDER] Teléfono

  // >>> CONDICIONES DEL SORTEO <<<
  terms: "Conservar esta parte del boleto para reclamar el premio. Sujeto a validación de Token.",

  // >>> CLAVE SECRETA INTERNA PARA FIRMA HMAC-SHA256 OFFLINE <<<
  secretKey: "FERRIPERNOS-CONTRERAS-STANLEY-DIC-2026-KEY#9981",

  defaultTicketCount: 300,
  ticketsPerPage: 8,
};
