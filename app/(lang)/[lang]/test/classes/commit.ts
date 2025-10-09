// /core/Commit.ts
import type {
    Message,
    UUID,
    ISODate,
    Model,
    Generator as GeneratorShape,
} from "./interface";
import Generator from "./generator";

// A commit can take either a live Generator instance or a plain Generator snapshot
export type GeneratorLike = Generator | GeneratorShape;

/** Utility: RFC4122-ish id generator */
const uid = (): UUID =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
        ? (crypto.randomUUID() as UUID)
        : ("xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        }) as UUID);

/** Deep snapshot (no references to live objects) */
function snapshotGenerator(gen: GeneratorLike): GeneratorShape {
    const base = "toJSON" in gen ? gen.toJSON() : gen;
    try {
        return structuredClone
            ? structuredClone(base)
            : JSON.parse(JSON.stringify(base));
    } catch {
        return JSON.parse(JSON.stringify(base));
    }
}

/** Structure of a serialized commit */
export interface CommitJSON {
    id: UUID;
    timestamp: ISODate;
    parentId?: UUID;
    isVersion: boolean;
    summary?: string;
    generator: GeneratorShape;
    model?: Model | null;
    messages: Message[];
}

/**
 * Commit = immutable snapshot of the generator + messages since previous commit.
 * If a 3D model was generated, isVersion = true and `model` is present.
 */
export class Commit implements CommitJSON {
    readonly id: UUID;
    readonly timestamp: ISODate;
    readonly parentId?: UUID;
    readonly isVersion: boolean;
    readonly summary?: string;
    readonly generator: GeneratorShape;
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

    /** Add a new message to this commit; returns a new immutable Commit */
    withMessage(
        msg: Omit<Message, "id" | "createdAt"> &
            Partial<Pick<Message, "id" | "createdAt">>
    ): Commit {
        const message: Message = {
            id: msg.id ?? uid(),
            createdAt: msg.createdAt ?? new Date().toISOString(),
            role: msg.role,
            content: msg.content,
            action: msg.action,
            attachments: msg.attachments,
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
            generator: this.generator,
            model: this.model ?? null,
            messages: this.messages.map((m) => ({
                ...m,
                attachments: m.attachments ? [...m.attachments] : undefined,
            })),
        };
    }

    /** Rehydrate from plain JSON (keeps generator as snapshot) */
    static fromJSON(json: CommitJSON): Commit {
        return new Commit({
            ...json,
            generator: snapshotGenerator(json.generator),
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
                return `Added new image (${payload?.count ?? "1"}).`;
            case "ASSIGN_SLOT":
                return `Assigned ${payload?.slot ?? "slot"} image.`;
            case "CLEAR_SLOT":
                return `Cleared ${payload?.slot ?? "slot"} image.`;
            case "GENERATE_IMAGE":
                return `Generated ${payload?.count ?? "?"} image(s).`;
            case "GENERATE_MODEL":
                return "3D model generated.";
            case "FORK":
                return `Forked from ${payload?.from ?? "unknown"}.`;
            case "REVERT":
                return `Reverted to commit ${payload?.to ?? "unknown"}.`;
            default:
                return "System action performed.";
        }
    }
}
