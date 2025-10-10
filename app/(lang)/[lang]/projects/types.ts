import {GeneratorModel3D} from "@/app/(lang)/[lang]/projects/classes/generator";

export type CommitJSON = {
  id: string;
  timestamp: string;      // ISO
  parentId?: string;
  isVersion: boolean;
  summary?: string;
  generator: GeneratorSnapshot;
  model?: { id: string; url?: string } | null;
  messages: Message[];
};

export type GeneratorSnapshot = {
  type: "text" | "image";
  textPrompt: string;
  images: Array<{ id?: string; url?: string; src?: string }>;
  designated: {
    front?: { url?: string; src?: string } | null;
    back?: { url?: string; src?: string } | null;
    side?: { url?: string; src?: string } | null;
    threeQuarter?: { url?: string; src?: string } | null;
    top?: { url?: string; src?: string } | null;
    bottom?: { url?: string; src?: string } | null;
  };
  dirtySinceLastModel: boolean;
  selectedKeys?: string[];
  selectedUrls?: string[];
  messages?: Message[]; // optional debug view
    models: GeneratorModel3D[]
};

export type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string; // ISO
  action?: { type: string; payload?: Record<string, unknown> };
};

export type ProjectState = {
  projectId: string;
  headId: string;
  commits: CommitJSON[];        // newest first for the sidebar
  generator: GeneratorSnapshot; // snapshot of current head
  messages: Message[];          // aggregated root->head
};

export type SlotType = 'front' | 'back' | 'side' | 'threeQuarter' | 'top' | 'bottom';
