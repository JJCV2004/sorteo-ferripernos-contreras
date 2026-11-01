# Sistema Generador e Impresión de Boletos Antifraude — FERRIPERNOS CONTRERAS

Aplicación web para la generación, previsualización, maquetación para impresión en **hojas A4** y **validación criptográfica 100% offline** de boletos para sorteo comercial (Gran Sorteo Navideño — Mochila Stanley).

---

## ¿De qué trata el proyecto?

Este sistema resuelve la necesidad de emitir boletos físicos para eventos y sorteos comerciales evitando:
1. **Falsificaciones o adulteraciones con IA**: Si alguien imprime un boleto falso o edita una fotografía cambiando el número ganador (por ejemplo, alterando un boleto para ponerle `#0010`), el sistema detecta de inmediato el engaño mediante un **Token Criptográfico Matemático**.
2. **Dependencia de Internet el día del sorteo**: La validación del boleto ganador se hace en el navegador de manera local y en milisegundos, sin consultar bases de datos externas ni requerir conexión Wi-Fi o datos móviles.
3. **Desperdicio de papel**: Cada hoja A4 está calibrada para imprimir **8 boletos dobles por página**.

---

## Estructura del Boleto (Diseño Doble en 2 Partes)

Cada boleto mide **`96mm × 64mm`** y se divide mediante una línea vertical punteada con marcas de tijera (`✂`):

1. **Parte Izquierda (Talón de Control / Urna — 33mm):**
   - Queda en la ferretería depositado en la tómbola o urna.
   - Contiene el **N° de Boleto grande** (ej. `#0010`).
   - Contiene el **Token de Firma único** (ej. `A8F9-3C12-E4B0`).
   - Campos punteados para registrar los datos del participante (`Nombre:`, `Tel:`, `Cédula:`).

2. **Parte Derecha (Comprobante del Participante / Cliente):**
   - Se lo lleva el cliente como comprobante.
   - Incluye el logo oficial de la ferretería, fecha, hora del sorteo, dirección y condiciones comerciales.
   - Presenta la imagen destacada del premio (Mochila Stanley de herramientas).
   - Incluye el mismo **N° de Boleto**, el mismo **Token de Firma** y un **Código QR de Control**.

---

## ¿Cómo funciona la Seguridad Antifraude Offline?

El sistema utiliza el estándar criptográfico **HMAC-SHA256** mediante la [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) nativa del navegador (con fallback determinista puro RFC 2104):

$$\text{Token} = \text{HMAC-SHA256}(\text{Clave Secreta}, \text{"FERRIPERNOS\_CONTRERAS|BOLETO:0010"})$$

- **Clave Secreta Interna:** Configurada en el sistema (no compartida al público).
- **Entropía:** Cada boleto genera un hash del cual se extraen 12 caracteres hexadecimales organizados en bloques legibles (`XXXX-XXXX-XXXX`), lo que representa más de **281 billones de combinaciones posibles**.
- **Imposible de falsificar:** Un participante no puede deducir qué token le corresponde al número ganador `#0010`. Aunque copie el formato visual, el token matemático no coincidirá con la clave del sistema.
- **Validación instantánea:** El día del evento se ingresa el número ganador y el token físico presentado; el software recalcula la firma en tiempo constante y dictamina si es **AUTÉNTICO Y VÁLIDO** o **FALSIFICADO / ADULTERADO**.

---

## Tecnologías y Librerías Utilizadas

- **[Next.js 15+ ](https://nextjs.org/):** Framework de React para estructuración moderna y renderizado de alto rendimiento.
- **[React 19](https://react.dev/):** Manejo de componentes modulares y estados reactivos.
- **[TypeScript](https://www.typescriptlang.org/):** Tipado estático estricto para garantizar solidez en las estructuras de datos.
- **[Tailwind CSS v4](https://tailwindcss.com/):** Estilos utilitarios y reglas específicas `@media print` para impresión precisa en escala 1:1.
- **[qrcode.react](https://github.com/zpao/qrcode.react):** Generación vectorial SVG de códigos QR dinámicos en cada boleto.
- **[Lucide React](https://lucide.dev/):** Iconografía moderna y ligera.
- **Web Crypto API:** Motor criptográfico de alta velocidad integrado en navegadores modernos.

---

## Metodología y Desarrollo Asistido por IA

Este proyecto fue desarrollado adoptando un flujo de trabajo moderno con herramientas de IA generativa (LLMs) como asistente de ingeniería, enfocado en acelerar el ciclo de desarrollo manteniendo control estricto sobre la arquitectura:

- **Prototipado y Aceleración:** Generación iterativa de maquetación CSS/Tailwind y calibración milimétrica para formatos físicos A4 (`@media print`).
- **Implementación Criptográfica Supervisada:** Consulta y verificación de primitivas nativas de la Web Crypto API (`HMAC-SHA256`) garantizando adherencia estricta al RFC 2104 y manejo seguro de firmas deterministas.
- **Auditoría y Refactorización Manual:** Revisión humana integral del código generado para asegurar tipado estricto en TypeScript, buenas prácticas de modularización en React 19 y separación de responsabilidades en la lógica de validación offline.

---
## Estructura del Código

```text
├── public/                     # Imágenes y assets estáticos (LoGO.png, mochila.png)
├── src/
│   ├── app/
│   │   ├── globals.css         # Estilos globales y reglas de impresión A4 (@media print)
│   │   ├── layout.tsx          # Layout principal y metadatos SEO
│   │   └── page.tsx            # Vista principal que coordina el estado de la app
│   ├── components/
│   │   ├── A4PrintSheet.tsx    # Cuadrícula de 8 boletos dobles por página A4
│   │   ├── ControlPanel.tsx    # Panel superior de configuración, edición y controles
│   │   ├── TicketCard.tsx      # Componente del boleto doble (Talón Urna + Comprobante)
│   │   └── ValidatorModal.tsx  # Módulo modal para verificación offline de boletos
│   ├── config/
│   │   └── raffleConfig.ts     # Configuración central (textos, rutas, fechas y clave secreta)
│   └── lib/
│       └── crypto.ts           # Algoritmos HMAC-SHA256, cálculo de tokens y verificación
├── .gitignore                  # Exclusión de node_modules y compilados
├── package.json                # Dependencias y scripts del proyecto
└── tsconfig.json               # Configuración de compilación TypeScript
```

---

## Instalación y Ejecución Local

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU-USUARIO/sorteo-ferripernos.git
cd sorteo-ferripernos
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Iniciar el servidor de desarrollo
```bash
npm run dev
```
Abre en tu navegador [http://localhost:3000](http://localhost:3000).

---

## Recomendaciones para la Impresión en PDF / Papel

Al presionar el botón **"Imprimir / Guardar PDF"**:
1. **Destino:** Guardar como PDF o seleccionar tu impresora.
2. **Tamaño de papel:** A4 (210mm × 297mm).
3. **Márgenes:** Ninguno (o Predeterminado).
4. **Escala:** 100% (Predeterminada).
5. **Opciones:** Marcar la casilla **"Gráficos de fondo"** para que se impriman los colores y badges de corte.
