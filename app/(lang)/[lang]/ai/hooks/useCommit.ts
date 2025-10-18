import {useSelector} from "react-redux";
import type {RootState} from "@/app/store";
import { store } from "@/app/store";
import {useCreateCommitMutation} from "@/app/(lang)/[lang]/ai/services/api";
import {useCallback} from "react";
import {toSnapshot} from "@/app/(lang)/[lang]/ai/libs/snapshots";
import useGenerator from "@/app/(lang)/[lang]/ai/hooks/useGenerator";

export default function useCommit() {
    const commitsState = useSelector((s: RootState) => (s as any)?.commits) ?? { entities: {}, headId: null };
    const commits = Object.values(commitsState.entities ?? {});
    const {gen} = useGenerator()
    const headId = commitsState.headId ?? null;
    const [createCommit, { isLoading: savingCommit }] = useCreateCommitMutation();

    // Create commit using the latest Redux state at call-time (not the render-time snapshot)
    const onCommit = useCallback(async (projectId: string) => {
        const state = store.getState() as RootState;
        const latestGen: any = (state as any)?.generator;
        const latestHeadId: string | null = (state as any)?.commits?.headId ?? null;
        const snapshot = toSnapshot(latestGen as any);
        await createCommit({
            projectId,
            parentId: latestHeadId,
            snapshot,
            message: `Checkpoint: ${new Date().toLocaleString()}`,
        });
    }, [createCommit]);

    return {commitsState,commits,headId,onCommit,savingCommit};
}