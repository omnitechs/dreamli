import type { Commit, UUID } from "./interface";

export interface CommitStore {
    get(id: UUID): Promise<Commit | undefined>;
    save(projectId: UUID, commit: Commit): Promise<void>;
    listByProject(projectId: UUID): Promise<Commit[]>;
}
