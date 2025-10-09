// interface.ts

// ----------------------------------
// 🔹 Basic shared types
// ----------------------------------
export type UUID = string;
export type Mode = "text" | "image";
export type ISODate = string;
export type DesignatedSlot =
    | "front"
    | "back"
    | "side"
    | "threeQuarter"
    | "top"
    | "bottom";

// ----------------------------------
// 🔹 Image
// ----------------------------------
export interface Image {
    id: UUID;
    src: string;
    alt?: string;
    createdAt: string; // ISO date
    source: "uploaded" | "generated" | "edited";
    promptUsed?: string; // if generated
    referenceImageIds?: UUID[]; // used as refs to maintain consistency
    tags?: string[];
    angle?: DesignatedSlot; // what the image represents
    locked?: boolean; // protected from changes
}

// ----------------------------------
// 🔹 Model (3D Output)
// ----------------------------------
export interface Model {
    id: UUID;
    status: "pending" | "succeeded" | "failed";
    createdAt: string;
    updatedAt?: string;
    previewSrc?: string;
    asset?: {
        format: "GLB" | "STL" | "OBJ";
        src: string;
        sizeBytes?: number;
        dimensionsMm?: { x: number; y: number; z: number };
        units?: "mm" | "cm" | "m";
    };
    inputsUsed: {
        mode: Mode;
        textPrompt?: string;
        designatedImageIds?: UUID[];
        fallbackPoolIds?: UUID[];
    };
    errorMessage?: string;
}

// ----------------------------------
// 🔹 Generator (Main working object)
// ----------------------------------
export interface Generator {
    type: Mode;
    textPrompt: string;
    images: Image[];
    designated: Partial<Record<DesignatedSlot, Image | null>>;
    approvalSet?: UUID[]; // ordered list of approved images for 3D
    dirtySinceLastModel: boolean;

}

// ----------------------------------
// 🔹 Chat Message (Logs every action)
// ----------------------------------
export type MessageRole = "user" | "assistant" | "system";

export interface Message {
    id: UUID;
    role: MessageRole;
    content: string;
    createdAt: string;
    action?: {
        type:
            | "SET_MODE"
            | "UPDATE_TEXT"
            | "ADD_IMAGE"
            | "ASSIGN_SLOT"
            | "CLEAR_SLOT"
            | "GENERATE_IMAGE"
            | "GENERATE_MODEL"
            | "FORK"
            | "REVERT";
        payload?: Record<string, any>;
    };
    attachments?: { type: "image"; imageId: UUID }[];
}

// ----------------------------------
// 🔹 Commit (Snapshot of progress)
// ----------------------------------
export interface Commit {
    id: UUID;
    timestamp: string;
    parentId?: UUID;
    branchId: UUID;
    forkedFromId?: UUID;
    isVersion: boolean; // true if contains generated model
    summary?: string;
    generator: Generator;
    model?: Model | null;
    messages: Message[];
}

// ----------------------------------
// 🔹 Version (Alias for commits with model)
// ----------------------------------
export type Version = Commit & { isVersion: true; model: Model };

// ----------------------------------
// 🔹 Project (Optional higher-level grouping)
// ----------------------------------
export interface Project {
    id: UUID;
    name: string;
    createdAt: string;
    commits: Commit[];
    activeCommitId: UUID;
}
