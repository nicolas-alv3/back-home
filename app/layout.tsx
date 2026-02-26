import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "BackHome - Recordar es volver a casa",
  description: "Reconstruir la memoria a través de vínculos y afectos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${nunito.variable} antialiased selection:bg-primary/30 min-h-screen flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
