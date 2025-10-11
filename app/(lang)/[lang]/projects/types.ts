// app/(lang)/[lang]/projects/types.ts
import type { CommitJSON } from "@/app/(lang)/[lang]/projects/classes/commit";
import type { GeneratorSnapshot } from "@/app/(lang)/[lang]/projects/classes/interface";
// Re-export canonical types from the classes to avoid divergence.
export type {
    Message,
    GeneratorSnapshot,
} from "@/app/(lang)/[lang]/projects/classes/interface";

export type {
    CommitJSON,
} from "@/app/(lang)/[lang]/projects/classes/commit";

export type {
    GeneratorModel3D,
} from "@/app/(lang)/[lang]/projects/classes/generator";

// UI-only helpers
export type SlotType =
    | "front"
    | "back"
    | "side"
    | "threeQuarter"
    | "top"
    | "bottom";

export type ProjectState = {
    projectId: string;
    headId: string;
    commits: CommitJSON[];        // newest first for the sidebar
    generator: GeneratorSnapshot; // exact snapshot of current head
    messages: Message[];          // aggregated root->head
};
