// ai/types.ts
export type UUID = string;
export type Mode = 'text' | 'image';

export interface Image {
    id: UUID;
    url: string;
    key: string;
    meta?: Record<string, any>;
}

export type MeshyKind = 'text' | 'image' | 'multi';
export type TextStage = 'preview' | 'refine';
export type MeshyTaskStatus = 'PENDING' | 'IN_PROGRESS' | 'SUCCEEDED' | 'FAILED' | 'CANCELED';

export interface ModelFormatUrls {
    glb?: string; fbx?: string; obj?: string; usdz?: string;
    [k: string]: string | undefined;
}

export interface GeneratorModel3D {
    id: string;                // == taskId
    provider: 'meshy';
    taskId: string;
    kind: MeshyKind;
    stage?: TextStage;
    prompt?: string;
    imageUrls?: string[];
    modelUrls: ModelFormatUrls;
    textureUrls?: Array<Record<string,string>>;
    thumbnailUrl?: string;
    previewVideoUrl?: string;
    createdAt: string;
    sourceCommitId?: string;
    rawTask?: any;
    status?: MeshyTaskStatus;
    progress?: number;
    error?: string;
    streaming?: boolean;
}

export type MessageRole = 'user' | 'assistant' | 'system';
export interface Message {
    id: UUID;
    role: MessageRole;
    content: string;
    createdAt: string;
}
