// app/projects/[projectId]/components/Build3DCard.tsx
"use client";

import { useState, useTransition } from "react";
import { actionGenerate3D } from "../actions";

type Props = {
    projectId: string;
    headId: string;
};

export function Build3DCard({ projectId, headId }: Props) {
    const [isPending, startTransition] = useTransition();
    const [status, setStatus] = useState<string>("");
    const [modelUrl, setModelUrl] = useState<string | undefined>(undefined);
    const [error, setError] = useState<string | null>(null);

    const onGenerate = () => {
        setError(null);
        setStatus("");
        setModelUrl(undefined);

        startTransition(async () => {
            try {
                const res = await actionGenerate3D(projectId, headId);
                setStatus(res.status || "succeeded");
                setModelUrl(res.modelUrl);
                // Parent state should refresh from returned ProjectState wherever you trigger a refresh.
                // If your workspace calls actionGenerate3D and replaces state from the return value,
                // this component will also reflect that change.
            } catch (e: any) {
                setError(e?.message ?? String(e));
            }
        });
    };

    return (
        <div className="rounded-xl border p-3 space-y-2">
            <div className="font-medium">3D</div>

            <button
                onClick={onGenerate}
                disabled={isPending}
                className="rounded px-4 py-2 border hover:bg-gray-50 disabled:opacity-60"
            >
                {isPending ? "Generating…" : "Generate 3D (Meshy)"}
            </button>

            {status ? (
                <div className="text-xs opacity-70">
                    Status: {status}
                    {modelUrl ? (
                        <>
                            {" "}
                            —{" "}
                            <a href={modelUrl} target="_blank" rel="noreferrer" className="underline">
                                Open model
                            </a>
                        </>
                    ) : null}
                </div>
            ) : null}

            {error ? (
                <div className="text-xs text-red-600">Error: {error}</div>
            ) : null}
        </div>
    );
}

export default Build3DCard;
