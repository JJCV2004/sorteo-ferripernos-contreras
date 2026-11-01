/**
 * ============================================================================
 * MÓDULO CRIPTOGRÁFICO ANTIFRAUDE OFFLINE (HMAC-SHA256)
 * ============================================================================
 * Genera y verifica firmas criptográficas 100% sin conexión a Internet.
 * Cada número de boleto produce un TOKEN único e irrepetible derivado de la
 * clave secreta de FERRIPERNOS CONTRERAS. Si alguien intenta falsificar o editar
 * un boleto con IA (ej. cambiar su número al #0010 ganador), su token no
 * coincidirá con el token matemático real del #0010.
 */

export interface TicketData {
  /** Número correlativo entero (ej. 1) */
  index: number;
  /** Número formateado a 4 dígitos (ej. "0001") */
  formattedNumber: string;
  /** Firma criptográfica HMAC-SHA256 limpia en mayúsculas (ej. "A8F93C12E4B0") */
  signature: string;
  /** Firma formateada en bloques legibles para lectura humana (ej. "A8F9-3C12-E4B0") */
  formattedSignature: string;
  /** Contenido completo codificado dentro del QR (ej. "numero:0001|sig:A8F93C12E4B0") */
  qrPayload: string;
}

export interface VerificationResult {
  isValid: boolean;
  status: "AUTHENTIC" | "FORGED" | "INVALID_FORMAT";
  ticketNumber?: string;
  providedSignature?: string;
  expectedSignature?: string;
  message: string;
  verifiedAt: string;
}

const SIGNATURE_LENGTH = 12; // 12 caracteres hex (48 bits = 281 billones de combinaciones posibles)

/**
 * Formatea un número de boleto a al menos 4 dígitos (ej. 10 -> "0010")
 */
export function formatTicketNumber(num: number): string {
  return String(num).padStart(4, "0");
}

/**
 * Formatea la firma de 12 caracteres con guiones (ej. "A8F9-3C12-E4B0")
 * para que sea muy fácil de leer y tipear el día del sorteo.
 */
export function formatTokenWithDashes(rawSig: string): string {
  const clean = rawSig.replace(/[^a-fA-F0-9]/g, "").toUpperCase();
  return clean.match(/.{1,4}/g)?.join("-") || clean;
}

/**
 * Construye el payload estándar del código QR
 * Formato: `numero:0001|sig:A8F93C12E4B0`
 */
export function buildQrPayload(formattedNumber: string, signature: string): string {
  return `numero:${formattedNumber}|sig:${signature.toUpperCase()}`;
}

/**
 * Genera la firma HMAC-SHA256 para un número de boleto y clave secreta.
 */
export async function generateTicketSignature(
  formattedNumber: string,
  secretKey: string
): Promise<string> {
  const normalizedNum = formattedNumber.trim().replace(/^#/, "").padStart(4, "0");
  const message = `FERRIPERNOS_CONTRERAS|BOLETO:${normalizedNum}`;

  if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
    try {
      const encoder = new TextEncoder();
      const keyData = encoder.encode(secretKey);
      const msgData = encoder.encode(message);

      const cryptoKey = await window.crypto.subtle.importKey(
        "raw",
        keyData,
        { name: "HMAC", hash: { name: "SHA-256" } },
        false,
        ["sign"]
      );

      const signatureBuffer = await window.crypto.subtle.sign("HMAC", cryptoKey, msgData);
      const hashArray = Array.from(new Uint8Array(signatureBuffer));
      const fullHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      return fullHex.slice(0, SIGNATURE_LENGTH).toUpperCase();
    } catch {
      return hmacSha256Fallback(secretKey, message)
        .slice(0, SIGNATURE_LENGTH)
        .toUpperCase();
    }
  }

  return hmacSha256Fallback(secretKey, message)
    .slice(0, SIGNATURE_LENGTH)
    .toUpperCase();
}

/**
 * Genera en lote todos los boletos firmados criptográficamente
 */
export async function generateSignedTicketsBatch(
  count: number,
  secretKey: string,
  startNumber: number = 1
): Promise<TicketData[]> {
  const tickets: TicketData[] = [];

  for (let i = 0; i < count; i++) {
    const num = startNumber + i;
    const formattedNumber = formatTicketNumber(num);
    const signature = await generateTicketSignature(formattedNumber, secretKey);
    const formattedSignature = formatTokenWithDashes(signature);
    const qrPayload = buildQrPayload(formattedNumber, signature);

    tickets.push({
      index: num,
      formattedNumber,
      signature,
      formattedSignature,
      qrPayload,
    });
  }

  return tickets;
}

/**
 * Comparación en tiempo constante para evitar ataques de timing
 */
function timingSafeEqualString(a: string, b: string): boolean {
  const strA = a.replace(/[^a-fA-F0-9]/g, "").toUpperCase();
  const strB = b.replace(/[^a-fA-F0-9]/g, "").toUpperCase();
  if (strA.length !== strB.length || strA.length === 0) return false;
  let result = 0;
  for (let i = 0; i < strA.length; i++) {
    result |= strA.charCodeAt(i) ^ strB.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Verifica directamente un boleto ingresando su NÚMERO (ej. "10" o "0010")
 * y el TOKEN DE FIRMA impreso en el boleto (ej. "A8F9-3C12-E4B0").
 */
export async function verifyByNumberAndTokenOffline(
  rawNumberInput: string,
  rawTokenInput: string,
  secretKey: string
): Promise<VerificationResult> {
  const timestamp = new Date().toLocaleTimeString("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const cleanDigits = rawNumberInput.trim().replace(/^#/, "").replace(/[^0-9]/g, "");
  if (!cleanDigits) {
    return {
      isValid: false,
      status: "INVALID_FORMAT",
      message: "Por favor ingresa un número de boleto válido (ej. 0010 o 10).",
      verifiedAt: timestamp,
    };
  }

  const formattedNumber = cleanDigits.padStart(4, "0");
  const cleanProvidedToken = rawTokenInput
    .trim()
    .replace(/[^a-fA-F0-9]/g, "")
    .toUpperCase();

  if (cleanProvidedToken.length < 6) {
    return {
      isValid: false,
      status: "INVALID_FORMAT",
      ticketNumber: formattedNumber,
      message:
        "El Token de Firma ingresado está incompleto. Ingresa los 12 caracteres alfanuméricos impresos en el boleto (ej. A8F9-3C12-E4B0).",
      verifiedAt: timestamp,
    };
  }

  const expectedSignature = await generateTicketSignature(formattedNumber, secretKey);
  const isAuthentic = timingSafeEqualString(cleanProvidedToken, expectedSignature);

  const formattedProvided = formatTokenWithDashes(cleanProvidedToken);
  const formattedExpected = formatTokenWithDashes(expectedSignature);

  if (isAuthentic) {
    return {
      isValid: true,
      status: "AUTHENTIC",
      ticketNumber: formattedNumber,
      providedSignature: formattedProvided,
      expectedSignature: formattedExpected,
      message: `¡BOLETO AUTÉNTICO! El Token (${formattedProvided}) corresponde matemáticamente al Boleto #${formattedNumber} generado por FERRIPERNOS CONTRERAS.`,
      verifiedAt: timestamp,
    };
  }

  return {
    isValid: false,
    status: "FORGED",
    ticketNumber: formattedNumber,
    providedSignature: formattedProvided,
    expectedSignature: formattedExpected,
    message: `¡ALERTA DE FALSIFICACIÓN! El Token (${formattedProvided}) NO corresponde al Boleto #${formattedNumber}. Es una copia adulterada, editada o falsificada.`,
    verifiedAt: timestamp,
  };
}

/**
 * Valida localmente (Offline) una cadena escaneada del QR (ej. `numero:0001|sig:A8F93C12E4B0`)
 */
export async function verifyQrPayloadOffline(
  rawPayload: string,
  secretKey: string
): Promise<VerificationResult> {
  const timestamp = new Date().toLocaleTimeString("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const cleaned = rawPayload.trim();
  const match = cleaned.match(/^numero:([0-9]+)\|sig:([a-fA-F0-9-]+)$/i);

  if (!match) {
    return {
      isValid: false,
      status: "INVALID_FORMAT",
      message:
        "El formato del texto QR no es válido. Se esperaba 'numero:0001|sig:XXXX' o usa la pestaña 'N° Boleto + Token'.",
      verifiedAt: timestamp,
    };
  }

  return verifyByNumberAndTokenOffline(match[1], match[2], secretKey);
}

/**
 * Implementación pura RFC 2104 HMAC-SHA256 (idéntica salida a Web Crypto API)
 */
function sha256Bytes(asciiBytes: Uint8Array): Uint8Array {
  const K = new Uint32Array([
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ]);

  const H = new Uint32Array([
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
  ]);

  const l = asciiBytes.length * 8;
  const k = (512 - ((l + 65) % 512)) % 512;
  const totalBytes = (l + 1 + k + 64) / 8;
  const padded = new Uint8Array(totalBytes);
  padded.set(asciiBytes);
  padded[asciiBytes.length] = 0x80;

  const view = new DataView(padded.buffer);
  view.setUint32(totalBytes - 4, l >>> 0, false);
  view.setUint32(totalBytes - 8, Math.floor(l / 0x100000000), false);

  const W = new Uint32Array(64);
  const rotr = (n: number, x: number) => (x >>> n) | (x << (32 - n));

  for (let offset = 0; offset < totalBytes; offset += 64) {
    for (let i = 0; i < 16; i++) {
      W[i] = view.getUint32(offset + i * 4, false);
    }
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(7, W[i - 15]) ^ rotr(18, W[i - 15]) ^ (W[i - 15] >>> 3);
      const s1 = rotr(17, W[i - 2]) ^ rotr(19, W[i - 2]) ^ (W[i - 2] >>> 10);
      W[i] = (W[i - 16] + s0 + W[i - 7] + s1) >>> 0;
    }

    let [a, b, c, d, e, f, g, h] = H;
    for (let i = 0; i < 64; i++) {
      const S1 = rotr(6, e) ^ rotr(11, e) ^ rotr(25, e);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + K[i] + W[i]) >>> 0;
      const S0 = rotr(2, a) ^ rotr(13, a) ^ rotr(22, a);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) >>> 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }

    H[0] = (H[0] + a) >>> 0;
    H[1] = (H[1] + b) >>> 0;
    H[2] = (H[2] + c) >>> 0;
    H[3] = (H[3] + d) >>> 0;
    H[4] = (H[4] + e) >>> 0;
    H[5] = (H[5] + f) >>> 0;
    H[6] = (H[6] + g) >>> 0;
    H[7] = (H[7] + h) >>> 0;
  }

  const out = new Uint8Array(32);
  const outView = new DataView(out.buffer);
  for (let i = 0; i < 8; i++) {
    outView.setUint32(i * 4, H[i], false);
  }
  return out;
}

function hmacSha256Fallback(key: string, message: string): string {
  const encoder = new TextEncoder();
  let keyBytes: Uint8Array = encoder.encode(key);
  const msgBytes: Uint8Array = encoder.encode(message);

  if (keyBytes.length > 64) {
    keyBytes = sha256Bytes(keyBytes);
  }

  const oKeyPad = new Uint8Array(64);
  const iKeyPad = new Uint8Array(64);
  for (let i = 0; i < 64; i++) {
    const kByte = keyBytes[i] || 0;
    oKeyPad[i] = kByte ^ 0x5c;
    iKeyPad[i] = kByte ^ 0x36;
  }

  const innerInput = new Uint8Array(64 + msgBytes.length);
  innerInput.set(iKeyPad, 0);
  innerInput.set(msgBytes, 64);
  const innerHash = sha256Bytes(innerInput);

  const outerInput = new Uint8Array(64 + 32);
  outerInput.set(oKeyPad, 0);
  outerInput.set(innerHash, 64);
  const finalHash = sha256Bytes(outerInput);

  return Array.from(finalHash)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
