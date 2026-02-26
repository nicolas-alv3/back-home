"use client";

import { X, User, PawPrint } from "lucide-react";
import type { Entity } from "../types";
import ReactMarkdown from "react-markdown";

interface NodeDetailsProps {
    entity: Entity;
    onClose: () => void;
}

export function NodeDetails({ entity, onClose }: NodeDetailsProps) {
    const isAnimal = ["animal", "perro", "gato", "mascota"].includes(
        entity.type.toLowerCase()
    );

    const imageUrl = entity.image?.startsWith("http")
        ? entity.image
        : entity.image
            ? `/images/${entity.image}`
            : null;

    return (
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
                <div className="w-24 h-24 rounded-full bg-[var(--color-primary)]/20 mb-4 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg relative shrink-0">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={entity.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                            }}
                        />
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
            </div>
        </div>
    );
}

