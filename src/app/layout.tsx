import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FERRIPERNOS CONTRERAS | Generador y Validador de Boletos - Sorteo Mochila Stanley",
  description:
    "Sistema web de generación, impresión A4 y validación antifraude offline (HMAC-SHA256) para el Gran Sorteo Navideño de Ferripernos Contreras.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
