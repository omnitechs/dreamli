import { Commit } from "./commit";
import Generator from "./generator";
import { generatorFromSnapshot } from "./rehydrate";
import type { CommitStore } from "./commitStore";
import type { Message, MessageRole, Model, UUID } from "./interface";

export default class WorkplaceService {
    private gen: Generator;
    private headId: UUID;
    private store: CommitStore;
    private projectId: UUID;

    constructor(store: CommitStore, projectId: UUID, headCommit?: Commit | null) {
        this.store = store;
        this.projectId = projectId;

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
            void this.store.save(this.projectId, initial);
        }
    }

    getGenerator(): Generator { return this.gen; }
    getHeadId(): UUID { return this.headId; }
    getProjectId(): UUID { return this.projectId; }

    // Switch head to a specific commit id (checkout)
    async checkout(commitId: UUID) {
        const c = await this.store.get(commitId);
        if (!c) throw new Error("Commit not found");
        this.headId = c.id;
        this.gen = generatorFromSnapshot(c.generator, ({ type, payload, message }) => {
            void this.createCommit(type, payload, message);
        });
    }

    postMessage(text: string, role: MessageRole = "user") {
        this.gen.addMessage(text, role);
    }

    async recordVersion(model: Model) {
        const c = Commit.createVersion({
            generator: this.gen,
            model,
            parentId: this.headId,
        });
        this.headId = c.id;
        this.gen.dirtySinceLastModel = false;
        await this.store.save(this.projectId, c);
    }

    async getAllMessages(): Promise<Message[]> {
        const commits = await this.collectChainFromRootToHead();
        const msgs: Message[] = [];
        for (const c of commits) if (c.messages?.length) msgs.push(...c.messages);
        return msgs;
    }

    async listCommitsNewestFirst() {
        return this.store.listByProject(this.projectId);
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
        await this.store.save(this.projectId, c);
    }

    private async collectChainFromRootToHead() {
        const chain: Commit[] = [];
        let id: UUID | undefined = this.headId;
        while (id) {
            const c = await this.store.get(id);
            if (!c) break;
            chain.push(c);
            id = (c.parentId as UUID | undefined) ?? undefined;
        }
        chain.reverse();
        return chain;
    }

    private summary(type?: NonNullable<Message["action"]>["type"], msg?: Message) {
        if (msg && !type) return `${msg.role} message`;
        switch (type) {
            case "SET_MODE": return "Mode changed";
            case "UPDATE_TEXT": return "Text updated";
            case "ADD_IMAGE": return "Image added";
            case "ASSIGN_SLOT": return "Slot assigned";
            case "UNASSIGN_SLOT": return "Slot unassigned";
            case "DELETE_IMAGE": return "Image deleted";
            case "CLEAR_SELECTION": return "Selection cleared";
            case "GENERATE_MODEL": return "3D model generated";
            default: return undefined;
        }
    }
}
