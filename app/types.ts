export type EntityType = "persona" | "animal" | "perro" | "gato" | "otro";

export interface Entity {
    id: string;
    name: string;
    type: EntityType | string;
    description?: string;
    image?: string;
}

export interface Relationship {
    source: string;
    target: string;
    relation: string;
}

export interface GraphData {
    entities: Entity[];
    relationships: Relationship[];
}
