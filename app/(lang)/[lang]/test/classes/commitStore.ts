import type { Commit, UUID } from "./interface";

export interface CommitStore {
    get(id: UUID): Commit | undefined;   // load a commit by id
    save(commit: Commit): void;          // persist a commit
}