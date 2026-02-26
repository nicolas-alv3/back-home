"use client";

import { useState, useEffect } from "react";
import { FileUploader } from "./components/FileUploader";
import { Graph } from "./components/Graph";
import { DataEditor } from "./components/DataEditor";
import type { GraphData } from "./types";
import { Heart, RefreshCcw, Download, Edit3 } from "lucide-react";

export default function Home() {
  const [data, setData] = useState<GraphData | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

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

  const handleExport = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "backhome.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditorOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)]/20 text-[var(--color-primary)] transition-colors rounded-full font-medium shadow-sm"
            >
              <Edit3 className="w-4 h-4" />
              Editar Vínculos
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors rounded-full font-medium shadow-sm"
            >
              <Download className="w-4 h-4" />
              Exportar
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--color-secondary)]/10 hover:bg-[var(--color-secondary)]/20 text-[var(--color-secondary)] transition-colors rounded-full font-medium shadow-sm"
            >
              <RefreshCcw className="w-4 h-4" />
              Cargar otro
            </button>
          </div>
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

      {isEditorOpen && data && (
        <DataEditor
          data={data}
          onSave={(newData) => {
            handleDataLoaded(newData);
            setIsEditorOpen(false);
          }}
          onClose={() => setIsEditorOpen(false)}
        />
      )}
    </main>
  );
}
