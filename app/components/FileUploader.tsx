"use client";

import { useState } from "react";
import { UploadCloud, FileJson } from "lucide-react";
import type { GraphData } from "../types";

interface FileUploaderProps {
    onDataLoaded: (data: GraphData) => void;
}

export function FileUploader({ onDataLoaded }: FileUploaderProps) {
    const [isHovering, setIsHovering] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = async (file: File | undefined) => {
        if (!file) return;

        setError(null);
        if (!file.name.endsWith(".json")) {
            setError("Por favor, subí un archivo .JSON válido.");
            return;
        }

        try {
            const text = await file.text();
            const json: GraphData = JSON.parse(text);

            if (!json.entities || !json.relationships) {
                throw new Error("El JSON no tiene el formato correcto.");
            }

            onDataLoaded(json);
        } catch (err: any) {
            setError(err.message || "Error al leer el archivo.");
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto mt-8">
            <div
                className={`relative border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${isHovering
                        ? "border-[var(--color-primary)] bg-white/50"
                        : "border-[var(--color-secondary)] bg-white/20"
                    }`}
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsHovering(true);
                }}
                onDragLeave={() => setIsHovering(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsHovering(false);
                    const file = e.dataTransfer.files[0];
                    handleFileChange(file);
                }}
            >
                <input
                    type="file"
                    accept=".json"
                    id="file-upload"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => handleFileChange(e.target.files?.[0])}
                />

                <div className="bg-[var(--color-primary)]/10 p-4 rounded-full mb-4">
                    <UploadCloud className="w-10 h-10 text-[var(--color-primary)]" />
                </div>

                <h3 className="text-xl font-semibold text-[var(--color-text-main)] mb-2">
                    Cargar mis vínculos
                </h3>
                <p className="text-[var(--color-text-main)]/70 text-center mb-6 max-w-sm">
                    Arrastrá el archivo con tus familiares y afectos o hacé clic acá para buscarlo en tu dispositivo.
                </p>

                <button className="px-6 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all transform hover:scale-105">
                    Seleccionar Archivo
                </button>
            </div>

            {error && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-xl text-center shadow-sm">
                    {error}
                </div>
            )}
        </div>
    );
}
