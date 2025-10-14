import {useSelector} from "react-redux";
import type {RootState} from "@/app/(lang)/[lang]/ai/store";
import {useCreateCommitMutation} from "@/app/(lang)/[lang]/ai/services/api";
import {useCallback} from "react";
import {toSnapshot} from "@/app/(lang)/[lang]/ai/libs/snapshots";

export default function useCommit() {
    const commitsState = useSelector((s: RootState) => (s as any)?.commits) ?? { entities: {}, headId: null };
    const commits = Object.values(commitsState.entities ?? {});
    const gen = useSelector((s: RootState) => (s as any)?.generator) ?? {
        type: 'text', textPrompt: '', images: [], selected: [],
        approvalSet: [], dirtySinceLastModel: false, messages: [],
    };
    const headId = commitsState.headId ?? null;
    const [createCommit, { isLoading: savingCommit }] = useCreateCommitMutation();
    const onCommit = useCallback(async (projectId:string) => {
        const snapshot = toSnapshot(gen as any);
        await createCommit({
            projectId: projectId,
            parentId: headId ?? null,
            snapshot,
            message: `Checkpoint: ${new Date().toLocaleString()}`,
        });
    }, [createCommit, gen, headId]);

    return {commitsState,commits,headId,onCommit,savingCommit};
}