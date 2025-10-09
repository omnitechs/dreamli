// /core/WorkplaceService.ts
import { Commit } from "./commit";
import Generator from "./generator";
import { generatorFromSnapshot } from "./rehydrate";
import type { CommitStore } from "./commitStore";
import type { Message, MessageRole, Model, UUID } from "./interface";

export default class WorkplaceService {
    private gen: Generator;
    private headId: UUID;
    private store: CommitStore;

    /**
     * If `headCommit` exists: rehydrate generator from it.
     * If not: create an initial commit from a fresh empty generator.
     */
    constructor(store: CommitStore, headCommit?: Commit | null) {
        this.store = store;

        if (headCommit) {
            this.headId = headCommit.id;
            this.gen = generatorFromSnapshot(headCommit.generator, ({ type, payload, message }) => {
                this.createCommit(type, payload, message);
            });
        } else {
            // empty generator wired first
            this.gen = new Generator("text", ({ type, payload, message }) => {
                this.createCommit(type, payload, message);
            });
            // initial commit
            const initial = Commit.create({
                generator: this.gen,
                parentId: undefined,
                summary: "Initial state",
                messages: [],
            });
            this.headId = initial.id;
            this.store.save(initial);
        }
    }

    /** Access the live generator (already wired to auto-commit). */
    getGenerator(): Generator {
        return this.gen;
    }

    /** Latest commit id (head of the linked list). */
    getHeadId(): UUID {
        return this.headId;
    }

    /** Append a chat message (this will auto-create a commit). */
    postMessage(text: string, role: MessageRole = "user") {
        this.gen.addMessage(text, role);
    }

    /** Create a version commit when a 3D model is produced. */
    recordVersion(model: Model) {
        const c = Commit.createVersion({
            generator: this.gen,
            model,
            parentId: this.headId,
        });
        this.headId = c.id;
        this.gen.dirtySinceLastModel = false;
        this.store.save(c);
    }

    /** Read ALL messages from the root up to the current head (chronological). */
    getAllMessages(): Message[] {
        return this.gen.messages;
    }

    // ——— internal ———

    private createCommit(
        type?: NonNullable<Message["action"]>["type"],
        payload?: Record<string, unknown>,
        message?: Message
    ) {
        let c = Commit.create({
            generator: this.gen,
            parentId: this.headId,
            summary: this.summary(type, message),
            messages: [],
        });

        if (type) c = c.withActionLog(type, payload);
        if (message) c = c.withMessage(message);

        this.headId = c.id;
        this.store.save(c);
    }

    private summary(type?: NonNullable<Message["action"]>["type"], msg?: Message) {
        if (msg && !type) return `${msg.role} message`;
        switch (type) {
            case "SET_MODE": return "Mode changed";
            case "UPDATE_TEXT": return "Text updated";
            case "ADD_IMAGE": return "Image added";
            case "ASSIGN_SLOT": return "Slot assigned";
            case "CLEAR_SLOT": return "Slot cleared";
            case "GENERATE_MODEL": return "3D model generated";
            default: return undefined;
        }
    }

}
