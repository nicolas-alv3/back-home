"use client";

import { useState, useEffect } from "react";
import { FileUploader } from "./components/FileUploader";
import { Graph } from "./components/Graph";
import { DataEditor } from "./components/DataEditor";
import type { GraphData } from "./types";
import { Heart, RefreshCcw, Download, Edit3, ArrowRight, UploadCloud, Users } from "lucide-react";

export default function Home() {
  const [data, setData] = useState<GraphData | null>(null);
  const [savedData, setSavedData] = useState<GraphData | null>(null);
  const [view, setView] = useState<"landing" | "upload" | "graph">("landing");
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  useEffect(() => {
    // Intentar recuperar los datos del localStorage
    const saved = localStorage.getItem("backHomeData");
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        setSavedData(parsedData);
        setData(parsedData);
        setView("graph");
      } catch (err) {
        console.error("Error al leer localStorage:", err);
      }
    }
  }, []);

  const handleDataLoaded = (newData: GraphData) => {
    setData(newData);
    try {
      localStorage.setItem("backHomeData", JSON.stringify(newData));
    } catch (err) {
      console.error("Error al guardar en localStorage:", err);
      alert("Hubo un problema al guardar los datos localmente (el archivo o las fotos son demasiado grandes). El límite suele ser de ~5MB.");
    }
    setSavedData(newData);
    setView("graph");
  };

  const handleCreateNew = () => {
    const emptyData: GraphData = { entities: [], relationships: [] };
    setData(emptyData);
    setView("graph");
    setIsEditorOpen(true); // Open the editor directly so they can start adding people
  };

  const handleReset = () => {
    setData(null);
    setView("upload");
  };

  const handleExport = () => {
    if (!data) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const a = document.createElement("a");
    a.href = dataStr;
    a.download = "backhome.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      {/* HEADER: Solo se muestra en el Uploader y en el Grafo */}
      {view !== "landing" && (
        <header className="w-full bg-white shadow-sm py-4 px-6 flex items-center justify-between border-b border-[var(--color-primary)]/20 shadow-[var(--color-primary)]/10 z-10 relative">
          <button
            onClick={() => setView("landing")}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity text-left"
          >
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
          </button>

          {data && view === "graph" && (
            <div className="flex items-center gap-3 flex-wrap justify-end">
              <button
                onClick={() => setIsEditorOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)]/20 text-[var(--color-primary)] transition-colors rounded-full font-medium shadow-sm"
              >
                <Edit3 className="w-4 h-4" />
                <span className="hidden sm:inline">Editar Vínculos</span>
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors rounded-full font-medium shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Exportar JSON</span>
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--color-secondary)]/10 hover:bg-[var(--color-secondary)]/20 text-[var(--color-secondary)] transition-colors rounded-full font-medium shadow-sm"
              >
                <RefreshCcw className="w-4 h-4" />
                <span className="hidden sm:inline">Cargar otro</span>
              </button>
            </div>
          )}
        </header>
      )}

      {/* ÁREA PRINCIPAL */}
      <div className={`flex-1 w-full bg-[var(--color-warm-beige)] relative overflow-hidden flex flex-col justify-center items-center ${view === 'landing' ? 'p-6' : ''}`}>

        {/* VISTA 1: LANDING PAGE */}
        {view === "landing" && (
          <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-12 items-center animate-in fade-in zoom-in-95 duration-700">
            <div className="flex flex-col gap-6 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-4 mb-2">
                <div className="bg-[var(--color-primary)]/20 p-4 rounded-full">
                  <Heart className="w-12 h-12 text-[var(--color-accent)] animate-pulse" />
                </div>
                <h1 className="text-5xl md:text-6xl font-extrabold text-[var(--color-text-main)] tracking-tight">
                  BackHome
                </h1>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-[var(--color-primary)]">
                Recordar es volver a casa.
              </p>
              <p className="text-xl text-[var(--color-text-main)]/80 leading-relaxed font-medium">
                Una herramienta cálida y muy sencilla que te ayuda a organizar y visualizar a tus seres queridos. Construí un árbol de vínculos interactivo, con fotos, anécdotas y mucho amor, ideal para preservar la memoria familiar.
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap gap-4 mt-8 justify-center lg:justify-start">
                {savedData && (
                  <button
                    onClick={() => { setData(savedData); setView("graph"); }}
                    className="px-8 py-4 bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/90 text-white transition-all rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-3 text-lg"
                  >
                    Continuar con tu familia
                    <ArrowRight className="w-6 h-6" />
                  </button>
                )}

                {!savedData && (
                  <button
                    onClick={handleCreateNew}
                    className="px-8 py-4 bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/90 text-white transition-all rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-3 text-lg"
                  >
                    Crear mi familia
                    <Users className="w-6 h-6" />
                  </button>
                )}

                <button
                  onClick={() => setView("upload")}
                  className={`px-8 py-4 flex items-center justify-center gap-3 font-bold rounded-full transition-all text-lg ${savedData ? 'bg-white text-[var(--color-primary)] border-2 border-[var(--color-primary)] hover:bg-[var(--color-primary)]/10' : 'bg-white text-[var(--color-text-main)] border-2 border-[var(--color-text-main)]/20 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'}`}
                >
                  <UploadCloud className="w-6 h-6" />
                  Importar JSON
                </button>
              </div>
            </div>

            <div className="hidden lg:flex justify-center items-center relative">
              <div className="absolute inset-0 bg-[var(--color-primary)]/10 rounded-full blur-3xl transform -translate-x-10 translate-y-10"></div>
              <div className="relative w-[340px] h-[460px] rounded-[3rem] overflow-hidden shadow-2xl border-[10px] border-white bg-gray-200 rotate-3 transition-transform hover:rotate-0 duration-500 hover:scale-105">
                <img src="https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&h=800&fit=crop" alt="Familia feliz con un atardecer" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-text-main)]/80 via-transparent to-transparent flex flex-col justify-end p-8">
                  <h3 className="text-white font-bold text-2xl mb-1">Tu Historia</h3>
                  <p className="text-white/90 font-medium text-lg">Porque cada persona importa.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VISTA 2: UPLOADER */}
        {view === "upload" && (
          <div className="w-full max-w-2xl px-6 py-12 animate-in slide-in-from-bottom-8 fade-in duration-500 flex flex-col items-center">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-extrabold text-[var(--color-text-main)] mb-4">
                Empecemos a recordar
              </h2>
              <p className="text-xl text-[var(--color-text-main)]/80 leading-relaxed font-medium">
                Cargá tu archivo de vínculos previo, o si preferís, podés <button onClick={handleCreateNew} className="text-[var(--color-primary)] underline font-bold hover:text-[var(--color-accent)] transition-colors">empezar desde cero</button> agregando gente manualmente.
              </p>
            </div>
            <FileUploader onDataLoaded={handleDataLoaded} />
          </div>
        )}

        {/* VISTA 3: EL ÁRBOL (GRAFO) */}
        {view === "graph" && data && (
          <div className="absolute inset-0 w-full h-full animate-in zoom-in-95 fade-in duration-500">
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
