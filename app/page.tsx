"use client";

import { useState, useEffect } from "react";
import { FileUploader } from "./components/FileUploader";
import { Graph } from "./components/Graph";
import type { GraphData } from "./types";
import { Heart, RefreshCcw } from "lucide-react";

export default function Home() {
  const [data, setData] = useState<GraphData | null>(null);

  useEffect(() => {
    // Intentar recuperar los datos del localStorage
    const savedData = localStorage.getItem("backHomeData");
    if (savedData) {
      try {
        setData(JSON.parse(savedData));
      } catch (err) {
        console.error("Error al leer localStorage:", err);
      }
    }
  }, []);

  const handleDataLoaded = (newData: GraphData) => {
    setData(newData);
    localStorage.setItem("backHomeData", JSON.stringify(newData));
  };

  const handleReset = () => {
    setData(null);
    localStorage.removeItem("backHomeData");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <header className="w-full bg-white shadow-sm py-4 px-6 flex items-center justify-between border-b border-[var(--color-primary)]/20 shadow-[var(--color-primary)]/10 z-10 relative">
        <div className="flex items-center gap-3">
          <div className="bg-[var(--color-primary)]/20 p-2 rounded-full">
            <Heart className="w-8 h-8 text-[var(--color-accent)] animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text-main)] tracking-tight">
              BackHome
            </h1>
            <p className="text-sm font-semibold text-[var(--color-primary)]">
              Recordar es volver a casa
            </p>
          </div>
        </div>

        {data && (
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--color-secondary)]/10 hover:bg-[var(--color-secondary)]/20 text-[var(--color-secondary)] transition-colors rounded-full font-medium shadow-sm"
          >
            <RefreshCcw className="w-4 h-4" />
            Cargar otro
          </button>
        )}
      </header>

      <div className="flex-1 w-full bg-[var(--color-warm-beige)] relative overflow-hidden flex flex-col justify-center items-center">
        {!data ? (
          <div className="w-full max-w-2xl px-6 py-12 animate-in fade-in duration-700 zoom-in-95 font-nunito flex flex-col items-center">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-extrabold text-[var(--color-text-main)] mb-4">
                Tus vínculos en un solo lugar
              </h2>
              <p className="text-xl text-[var(--color-text-main)]/80 leading-relaxed font-medium">
                Cargá tu archivo de vínculos para empezar a recordar. Cada persona y cada mascota tienen un lugar especial en nuestra historia.
              </p>
            </div>

            <FileUploader onDataLoaded={handleDataLoaded} />
          </div>
        ) : (
          <div className="absolute inset-0 w-full h-full animate-in fade-in duration-500">
            <Graph data={data} />
          </div>
        )}
      </div>
    </main>
  );
}
