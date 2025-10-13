import type { GeneratorModel3D, MeshyKind, TextStage, ModelFormatUrls } from "../store/slices/generatorSlice";

export function mapTaskToModel(
    task: any,
    meta?: { kind?: MeshyKind; stage?: TextStage; prompt?: string; imageUrls?: string[]; sourceCommitId?: string | null }
): GeneratorModel3D {
    const modelUrls: ModelFormatUrls = { ...(task.model_urls ?? {}) };
    return {
        id: task.id,
        provider: "meshy",
        taskId: task.id,
        kind: meta?.kind ?? "text",
        stage: meta?.stage,
        prompt: meta?.prompt ?? task.prompt,
        imageUrls: meta?.imageUrls,
        modelUrls,
        textureUrls: task.texture_urls,
        thumbnailUrl: task.thumbnail_url,
        previewVideoUrl: task.video_url,
        createdAt: new Date().toISOString(),
        sourceCommitId: meta?.sourceCommitId ?? undefined,
        rawTask: undefined,
        status: task.status,
        progress: task.progress,
    };
}
