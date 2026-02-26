"use client";

import { useState } from "react";
import { X, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import type { GraphData, Entity, Relationship } from "../types";

interface DataEditorProps {
    data: GraphData;
    onSave: (data: GraphData) => void;
    onClose: () => void;
}

export function DataEditor({ data, onSave, onClose }: DataEditorProps) {
    const [entities, setEntities] = useState<Entity[]>(data.entities);
    const [relationships, setRelationships] = useState<Relationship[]>(data.relationships);
    const [activeTab, setActiveTab] = useState<"entities" | "relationships">("entities");

    const addEntity = () => {
        const newEntity: Entity = {
            id: Date.now().toString(),
            name: "Nueva Persona",
            type: "persona",
            description: "",
            image: ""
        };
        setEntities([...entities, newEntity]);
    };

    const updateEntity = (id: string, field: keyof Entity, value: string) => {
        setEntities(entities.map(e => e.id === id ? { ...e, [field]: value } : e));
    };

    const removeEntity = (id: string) => {
        setEntities(entities.filter(e => e.id !== id));
        // Also remove relationships involving this entity
        setRelationships(relationships.filter(r => r.source !== id && r.target !== id));
    };

    const addRelationship = () => {
        if (entities.length < 2) return; // Need at least 2 entities
        const newRel: Relationship = {
            source: entities[0].id,
            target: entities[1].id,
            relation: "nueva relación"
        };
        setRelationships([...relationships, newRel]);
    };

    const updateRelationship = (index: number, field: keyof Relationship, value: string) => {
        const newRels = [...relationships];
        newRels[index] = { ...newRels[index], [field]: value };
        setRelationships(newRels);
    };

    const removeRelationship = (index: number) => {
        setRelationships(relationships.filter((_, i) => i !== index));
    };

    const handleSave = () => {
        onSave({ entities, relationships });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-[var(--color-warm-beige)]">
                    <h2 className="text-2xl font-bold text-[var(--color-text-main)]">Administrar Vínculos</h2>
                    <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                <div className="flex border-b border-gray-100">
                    <button
                        className={`flex-1 py-4 font-semibold text-lg transition-colors ${activeTab === "entities" ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]" : "text-gray-500 hover:text-gray-700"}`}
                        onClick={() => setActiveTab("entities")}
                    >
                        Personas y Mascotas ({entities.length})
                    </button>
                    <button
                        className={`flex-1 py-4 font-semibold text-lg transition-colors ${activeTab === "relationships" ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]" : "text-gray-500 hover:text-gray-700"}`}
                        onClick={() => setActiveTab("relationships")}
                    >
                        Conexiones ({relationships.length})
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    {activeTab === "entities" && (
                        <div className="space-y-4">
                            {entities.map(entity => (
                                <div key={entity.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4 relative group">
                                    <button onClick={() => removeEntity(entity.id)} className="absolute top-4 right-4 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100">
                                        <Trash2 className="w-5 h-5" />
                                    </button>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mr-10">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-600 mb-1">Nombre</label>
                                            <input type="text" value={entity.name} onChange={e => updateEntity(entity.id, "name", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-gray-50" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-600 mb-1">Tipo</label>
                                            <select value={entity.type} onChange={e => updateEntity(entity.id, "type", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-gray-50">
                                                <option value="persona">Persona</option>
                                                <option value="perro">Perro</option>
                                                <option value="gato">Gato</option>
                                                <option value="mascota">Otra Mascota</option>
                                            </select>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-600 mb-1">Descripción (Soporta Markdown)</label>
                                            <textarea rows={2} value={entity.description || ""} onChange={e => updateEntity(entity.id, "description", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-gray-50" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-600 mb-1 flex items-center gap-2"><ImageIcon className="w-4 h-4" /> URL de la Foto</label>
                                            <input type="text" placeholder="https://..." value={entity.image || ""} onChange={e => updateEntity(entity.id, "image", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-gray-50" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button onClick={addEntity} className="w-full py-4 border-2 border-dashed border-[var(--color-primary)]/50 rounded-2xl text-[var(--color-primary)] font-semibold flex items-center justify-center gap-2 hover:bg-[var(--color-primary)]/5 transition-colors">
                                <Plus className="w-5 h-5" /> Agregar Persona o Mascota
                            </button>
                        </div>
                    )}

                    {activeTab === "relationships" && (
                        <div className="space-y-4">
                            {relationships.map((rel, index) => (
                                <div key={index} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-end gap-4 relative group">
                                    <div className="flex-1">
                                        <label className="block text-sm font-semibold text-gray-600 mb-1">Origen</label>
                                        <select value={rel.source} onChange={e => updateRelationship(index, "source", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-gray-50">
                                            {entities.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm font-semibold text-gray-600 mb-1">Relación (ej. padre)</label>
                                        <input type="text" value={rel.relation} onChange={e => updateRelationship(index, "relation", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-gray-50" />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm font-semibold text-gray-600 mb-1">Destino</label>
                                        <select value={rel.target} onChange={e => updateRelationship(index, "target", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-gray-50">
                                            {entities.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                                        </select>
                                    </div>
                                    <button onClick={() => removeRelationship(index)} className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors mb-[2px]">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                            {entities.length >= 2 ? (
                                <button onClick={addRelationship} className="w-full py-4 border-2 border-dashed border-[var(--color-secondary)]/50 rounded-2xl text-[var(--color-secondary)] font-semibold flex items-center justify-center gap-2 hover:bg-[var(--color-secondary)]/5 transition-colors">
                                    <Plus className="w-5 h-5" /> Agregar Conexión
                                </button>
                            ) : (
                                <p className="text-center text-gray-500 py-8">Agrega al menos dos personas/mascotas para poder conectarlas.</p>
                            )}
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-gray-100 bg-white flex justify-end gap-4">
                    <button onClick={onClose} className="px-6 py-2 font-semibold text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                        Cancelar
                    </button>
                    <button onClick={handleSave} className="px-6 py-2 font-semibold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 rounded-full shadow-md transition-all">
                        Guardar Cambios
                    </button>
                </div>
            </div>
        </div>
    );
}
