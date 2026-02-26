"use client";
import { useState } from "react";
import { X, User, PawPrint, ZoomIn } from "lucide-react";
import type { Entity } from "../types";
import ReactMarkdown from "react-markdown";

interface NodeDetailsProps {
    entity: Entity;
    onClose: () => void;
}

export function NodeDetails({ entity, onClose }: NodeDetailsProps) {
    const [maximizedImg, setMaximizedImg] = useState<string | null>(null);
    const isAnimal = ["animal", "perro", "gato", "mascota"].includes(
        entity.type.toLowerCase()
    );

    const entityImages = entity.images && entity.images.length > 0 ? entity.images : (entity.image ? [entity.image] : []);
    const parsedImages = entityImages
        .filter(img => img.trim() !== "")
        .map(img => img.startsWith("http") || img.startsWith("data:image/") ? img : `/images/${img}`);
    const imageUrl = parsedImages.length > 0 ? parsedImages[0] : null;

    return (
        <>
            <div className="absolute right-6 top-6 w-80 bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100 z-50 animate-in slide-in-from-right fade-in duration-300">
                <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-[var(--color-secondary)]/5">
                    <h3 className="text-sm font-semibold text-[var(--color-secondary)] uppercase tracking-wider">
                        Detalles del vínculo
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-[var(--color-text-main)]/10 transition-colors text-[var(--color-text-main)]"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 flex flex-col items-center">
                    <div
                        className={`w-24 h-24 rounded-full bg-[var(--color-primary)]/20 mb-4 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg relative shrink-0 ${imageUrl ? 'cursor-pointer group' : ''}`}
                        onClick={() => imageUrl && setMaximizedImg(imageUrl)}
                    >
                        {imageUrl ? (
                            <>
                                <img
                                    src={imageUrl}
                                    alt={entity.name}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                    }}
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <ZoomIn className="w-6 h-6 text-white" />
                                </div>
                            </>
                        ) : isAnimal ? (
                            <PawPrint className="w-12 h-12 text-[var(--color-primary)]" />
                        ) : (
                            <User className="w-12 h-12 text-[var(--color-primary)]" />
                        )}
                    </div>

                    <h2 className="text-2xl font-bold text-[var(--color-text-main)] mb-1 text-center">
                        {entity.name}
                    </h2>

                    <span className="px-3 py-1 bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] rounded-full text-xs font-semibold uppercase tracking-widest mb-4 inline-block">
                        {entity.type}
                    </span>

                    {entity.description && (
                        <div className="text-center text-[var(--color-text-main)]/80 text-base leading-relaxed prose prose-sm max-w-none">
                            <ReactMarkdown>{entity.description}</ReactMarkdown>
                        </div>
                    )}

                    {parsedImages.length > 1 && (
                        <div className="mt-6 w-full">
                            <h4 className="text-xs font-bold text-gray-400 mb-3 text-center uppercase tracking-wider">Galería</h4>
                            <div className="flex justify-center gap-3 flex-wrap">
                                {parsedImages.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={img}
                                        alt={`Foto ${idx + 1} de ${entity.name}`}
                                        title={`Ver imagen ${idx + 1}`}
                                        onClick={() => setMaximizedImg(img)}
                                        className="w-16 h-16 rounded-xl object-cover border-2 border-[var(--color-primary)]/20 shadow-sm cursor-pointer hover:border-[var(--color-primary)] hover:scale-105 transition-all"
                                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {maximizedImg && (
                <div
                    className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
                    onClick={() => setMaximizedImg(null)}
                >
                    <button
                        className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-[101]"
                        onClick={() => setMaximizedImg(null)}
                    >
                        <X className="w-8 h-8" />
                    </button>
                    <img
                        src={maximizedImg}
                        alt={entity.name}
                        className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl shadow-2xl border border-white/10"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </>
    );
}

