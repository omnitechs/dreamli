// @flow
import * as React from 'react';
import {fromSnapshot} from "@/app/(lang)/[lang]/ai/libs/snapshots";
import {replaceWithSnapshot} from "@/app/(lang)/[lang]/ai/store/slices/generatorSlice";
import {Commit, setHead} from "@/app/(lang)/[lang]/ai/store/slices/commitsSlice";
import {useDispatch} from "react-redux";


type Props = {
    commit: Commit;
};

export function CommitButton(props: Props) {
    const dispatch = useDispatch();
    const {commit} = props;
    

    return (
        <button
            type="button"
            onClick={() => {
                if (!commit?.snapshot) {
                    console.warn("Commit has no snapshot:", commit);
                    return;
                }
                const restored = fromSnapshot(commit.snapshot);
                dispatch(replaceWithSnapshot(restored));
                dispatch(setHead(commit.id));
            }}
            className="w-full text-left flex items-center justify-between rounded-xl border p-2 hover:bg-gray-50 cursor-pointer"
            title="Click to checkout this commit"
        >
            <div className="min-w-0">
                <div className="text-sm font-medium truncate">{commit.message ?? "Commit"}</div>
                <div className="text-xs text-gray-500">{new Date(commit.createdAt).toLocaleString()}</div>
            </div>
            <code className="text-[10px] text-gray-500 ml-2">{String(commit.id).slice(0, 8)}</code>
        </button>
    );
};