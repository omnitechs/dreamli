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

    constructor(store: CommitStore, headCommit?: Commit | null) {
        this.store = store;

        if (headCommit) {
            this.headId = headCommit.id;
            this.gen = generatorFromSnapshot(headCommit.generator, ({ type, payload, message }) => {
                void this.createCommit(type, payload, message);
            });
        } else {
            this.gen = new Generator("text", ({ type, payload, message }) => {
                void this.createCommit(type, payload, message);
            });
            const initial = Commit.create({
                generator: this.gen,
                parentId: undefined,
                summary: "Initial state",
                messages: [],
            });
            this.headId = initial.id;
            void this.store.save(initial);
        }
    }

    getGenerator(): Generator { return this.gen; }
    getHeadId(): UUID { return this.headId; }

    postMessage(text: string, role: MessageRole = "user") {
        this.gen.addMessage(text, role); // auto-commit via onChange
    }

    async recordVersion(model: Model) {
        const c = Commit.createVersion({
            generator: this.gen,
            model,
            parentId: this.headId,
        });
        this.headId = c.id;
        this.gen.dirtySinceLastModel = false;
        await this.store.save(c);
    }

    getAllMessages(): Message[] {
        return this.gen.messages;
    }

    // ——— internal ———
    private async createCommit(
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
        await this.store.save(c);
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
