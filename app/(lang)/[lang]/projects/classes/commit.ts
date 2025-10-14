// app/(lang)/[lang]/projects/classes/commit.ts

import type {
    Message,
    UUID,
    ISODate,
    Model,
    GeneratorSnapshot,     // <- use the snapshot (matches toJSON)
    Generator as GeneratorShape,
} from "./interface";

import uid from "../helper/uuid";

// Safe clone helper (handles environments without structuredClone)
function safeClone<T>(obj: T): T {
    try {
        // @ts-ignore - structuredClone may not be in lib.dom.d.ts
        if (typeof structuredClone === "function") return structuredClone(obj);
    } catch { /* noop */ }
    return JSON.parse(JSON.stringify(obj));
}

export type GeneratorLike = GeneratorShape | { toJSON(): GeneratorSnapshot };

/** Always produce the JSON snapshot shape returned by Generator.toJSON() */
function snapshotGenerator(gen: GeneratorLike): GeneratorSnapshot {
    const base =
        "toJSON" in gen ? (gen as { toJSON(): GeneratorSnapshot }).toJSON()
            : (gen as unknown as GeneratorSnapshot);
    return safeClone(base);
}

/** Structure of a serialized commit */
export interface CommitJSON {
    id: UUID;
    timestamp: ISODate;
    parentId?: UUID;
    isVersion: boolean;
    summary?: string;
    generator: GeneratorSnapshot; // ← snapshot, not bare Generator
    model?: Model | null;
    messages: Message[];
}

/**
 * CommitsPanel = immutable snapshot of the generator + messages since previous commit.
 * If a 3D model was generated, isVersion = true and `model` is present.
 */
export class Commit implements CommitJSON {
    readonly id: UUID;
    readonly timestamp: ISODate;
    readonly parentId?: UUID;
    readonly isVersion: boolean;
    readonly summary?: string;
    readonly generator: GeneratorSnapshot;
    readonly model?: Model | null;
    readonly messages: Message[];

    private constructor(json: CommitJSON) {
        this.id = json.id;
        this.timestamp = json.timestamp;
        this.parentId = json.parentId;
        this.isVersion = json.isVersion;
        this.summary = json.summary;
        this.generator = json.generator;
        this.model = json.model;
        this.messages = json.messages;
    }

    /** Factory: create a new non-version commit from a Generator snapshot */
    static create(params: {
        generator: GeneratorLike;
        parentId?: UUID;
        branchId?: UUID;
        forkedFromId?: UUID;
        summary?: string;
        messages?: Message[];
    }): Commit {
        const now = new Date().toISOString();
        return new Commit({
            id: uid(),
            timestamp: now,
            parentId: params.parentId,
            isVersion: false,
            summary: params.summary,
            generator: snapshotGenerator(params.generator),
            model: null,
            messages: params.messages ?? [],
        });
    }

    /** Factory: create a version (3D-generated) commit */
    static createVersion(params: {
        generator: GeneratorLike;
        model: Model;
        parentId?: UUID;
        branchId?: UUID;
        forkedFromId?: UUID;
        summary?: string;
        messages?: Message[];
    }): Commit {
        const now = new Date().toISOString();
        return new Commit({
            id: uid(),
            timestamp: now,
            parentId: params.parentId,
            isVersion: true,
            summary: params.summary ?? "3D model generated",
            generator: snapshotGenerator(params.generator),
            model: { ...params.model },
            messages: params.messages ?? [],
        });
    }

    /** Add a new message to this commit; returns a new immutable CommitsPanel */
    withMessage(
        msg: Omit<Message, "id" | "createdAt"> & Partial<Pick<Message, "id" | "createdAt">>
    ): Commit {
        const message: Message = {
            id: msg.id ?? uid(),
            createdAt: msg.createdAt ?? new Date().toISOString(),
            role: msg.role,
            content: msg.content,
            action: msg.action,
            attachments: (msg as any).attachments,
        };
        return new Commit({
            ...this.toJSON(),
            messages: [...this.messages, message],
        });
    }

    /** Add a structured system log */
    withActionLog(
        type: NonNullable<Message["action"]>["type"],
        payload?: Record<string, unknown>,
        text?: string
    ): Commit {
        const content = text ?? Commit.defaultActionContent(type, payload);
        return this.withMessage({
            role: "system",
            content,
            action: { type, payload },
        });
    }

    /** Fork starting from this commit */
    fork(newBranchId?: UUID): Commit {
        return new Commit({
            ...this.toJSON(),
            id: uid(),
            timestamp: new Date().toISOString(),
            parentId: this.id,
            messages: [],
        });
    }

    /** Serialize to plain JSON for DB or API */
    toJSON(): CommitJSON {
        return {
            id: this.id,
            timestamp: this.timestamp,
            parentId: this.parentId,
            isVersion: this.isVersion,
            summary: this.summary,
            generator: safeClone(this.generator),
            model: this.model ?? null,
            messages: this.messages.map((m) => ({
                ...m,
                attachments: (m as any).attachments ? [ ...(m as any).attachments ] : undefined,
            })),
        };
    }

    /** Rehydrate from plain JSON (keeps generator as snapshot) */
    static fromJSON(json: CommitJSON): Commit {
        return new Commit({
            ...json,
            generator: safeClone(json.generator),
            messages: json.messages.map((m) => ({ ...m })),
            model: json.model ? { ...json.model } : null,
        });
    }

    /** Generate human-readable system message for a known action type */
    private static defaultActionContent(
        type: NonNullable<Message["action"]>["type"],
        payload?: Record<string, unknown>
    ): string {
        switch (type) {
            case "SET_MODE":
                return `Mode changed to ${(payload?.mode as string) ?? "unknown"}.`;
            case "UPDATE_TEXT":
                return "Text prompt updated.";
            case "ADD_IMAGE":
                return `Added new image (${(payload as any)?.count ?? "1"}).`;
            case "ASSIGN_SLOT":
                return `Assigned ${(payload as any)?.slot ?? "slot"} image.`;
            case "CLEAR_SLOT":
                return `Cleared ${(payload as any)?.slot ?? "slot"} image.`;
            case "GENERATE_IMAGE":
                return `Generated ${(payload as any)?.count ?? "?"} image(s).`;
            case "GENERATE_MODEL":
                return "3D model generated.";
            case "FORK":
                return `Forked from ${(payload as any)?.from ?? "unknown"}.`;
            case "REVERT":
                return `Reverted to commit ${(payload as any)?.to ?? "unknown"}.`;
            default:
                return "System action performed.";
        }
    }
}
