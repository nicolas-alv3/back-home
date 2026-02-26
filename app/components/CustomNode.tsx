import { Handle, Position } from "@xyflow/react";
import { User, PawPrint } from "lucide-react";

export function CustomNode({ data, selected }: any) {
    const isAnimal = ["animal", "perro", "gato", "mascota"].includes(
        (data.type || "").toLowerCase()
    );

    const firstImage = (data.images && data.images.length > 0) ? data.images[0] : data.image;
    const imageUrl = firstImage?.startsWith("http") || firstImage?.startsWith("data:image/")
        ? firstImage
        : firstImage
            ? `/images/${firstImage}`
            : null;

    const bgColor = isAnimal ? "bg-[var(--color-primary)]" : "bg-[var(--color-secondary)]";

    return (
        <div
            className={`relative flex items-center gap-3 px-4 py-2 rounded-full text-white font-bold font-nunito text-lg shadow-md transition-all ${bgColor} ${selected ? "ring-4 ring-offset-4 ring-[var(--color-accent)] z-10 scale-105" : ""
                }`}
            style={{ minWidth: "140px" }}
        >
            <Handle type="target" position={Position.Top} className="opacity-0" />
            <Handle type="source" position={Position.Bottom} className="opacity-0" />

            {/* Avatar Circle */}
            <div className="w-10 h-10 shrink-0 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border-2 border-white/50">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={data.label}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.currentTarget.style.display = "none";
                        }}
                    />
                ) : isAnimal ? (
                    <PawPrint className="w-5 h-5 text-white" />
                ) : (
                    <User className="w-5 h-5 text-white" />
                )}
            </div>

            {/* Node Label */}
            <span className="truncate pr-2">{data.label}</span>

            <Handle type="source" position={Position.Right} id="right" className="opacity-0 hidden" />
            <Handle type="target" position={Position.Left} id="left" className="opacity-0 hidden" />
        </div>
    );
}
