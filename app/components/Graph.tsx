"use client";

import { useMemo, useCallback, useState, useEffect } from "react";
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    MarkerType,
} from "@xyflow/react";
import type { Node, Edge, ConnectionLineType } from "@xyflow/react";
import type { GraphData, Entity } from "../types";
import { NodeDetails } from "./NodeDetails";
import { CustomNode } from "./CustomNode";
import { Search } from "lucide-react";

const nodeTypes = {
    custom: CustomNode,
};

interface GraphProps {
    data: GraphData;
}

export function Graph({ data }: GraphProps) {
    const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const initialNodes: Node[] = data.entities.map((entity, index) => {
        // Generate a basic layout, placing nodes in a semi-circle or grid
        const cols = Math.ceil(Math.sqrt(data.entities.length));
        const x = (index % cols) * 250;
        const y = Math.floor(index / cols) * 200;

        const isAnimal = ["animal", "perro", "gato", "mascota"].includes(
            entity.type.toLowerCase()
        );

        return {
            id: entity.id,
            position: { x, y },
            type: "custom",
            data: { label: entity.name, type: entity.type, image: entity.image },
        };
    });

    const initialEdges: Edge[] = data.relationships.map((rel, i) => ({
        id: `e${rel.source}-${rel.target}-${i}`,
        source: rel.source,
        target: rel.target,
        label: rel.relation,
        animated: true,
        style: { stroke: "var(--color-text-main)", strokeWidth: 2 },
        labelStyle: {
            fill: "var(--color-text-main)",
            fontWeight: 'bold',
            fontSize: 14,
            fontFamily: "var(--font-nunito)",
        },
        labelBgStyle: { fill: "white", fillOpacity: 0.8 },
        markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "var(--color-text-main)",
        },
    }));

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    // Search feature highlight effect
    useEffect(() => {
        if (!searchTerm) {
            setNodes((nds) =>
                nds.map((node) => ({
                    ...node,
                    style: { ...node.style, opacity: 1 },
                }))
            );
            return;
        }

        setNodes((nds) =>
            nds.map((node) => {
                const match = (node.data.label as string)
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());

                return {
                    ...node,
                    selected: match ? true : false,
                    style: {
                        ...node.style,
                        opacity: match ? 1 : 0.2,
                        transition: "opacity 0.3s ease",
                    },
                };
            })
        );
    }, [searchTerm, setNodes]);

    const onNodeClick = useCallback(
        (_: React.MouseEvent, node: Node) => {
            const entity = data.entities.find((e) => e.id === node.id);
            if (entity) setSelectedEntity(entity);
        },
        [data]
    );

    return (
        <div className="w-full h-full relative">
            <div className="absolute top-4 left-4 z-40 bg-white p-2 rounded-full shadow-lg flex items-center border border-gray-100">
                <Search className="text-gray-400 ml-2 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Buscar vínculo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="outline-none px-4 py-2 bg-transparent text-[var(--color-text-main)] w-64 "
                />
            </div>

            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                fitView
                connectOnClick={false}
                nodesDraggable={true}
                nodesConnectable={false}
                elementsSelectable={true}
            >
                <Background color="var(--color-secondary)" gap={24} size={2} className="opacity-20" />
                <Controls
                    showInteractive={false}
                    className="bg-white rounded-xl shadow-lg border-gray-100 overflow-hidden"
                />
                <MiniMap
                    nodeColor={(node) => {
                        const isAnimal = ["animal", "perro", "gato", "mascota"].includes(
                            ((node.data?.type as string) || "").toLowerCase()
                        );
                        return isAnimal ? "var(--color-primary)" : "var(--color-secondary)";
                    }}
                    nodeStrokeWidth={3}
                    zoomable
                    pannable
                    className="rounded-xl shadow-lg border border-gray-100 bg-white"
                />
            </ReactFlow>

            {selectedEntity && (
                <NodeDetails
                    entity={selectedEntity}
                    onClose={() => setSelectedEntity(null)}
                />
            )}
        </div>
    );
}
