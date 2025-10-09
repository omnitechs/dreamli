//commitStore.ts
import type { UUID } from "./interface";
import { Commit } from "./commit";

export interface CommitStore {
    get(id: UUID): Promise<Commit | undefined>;
    save(commit: Commit): Promise<void>;
}