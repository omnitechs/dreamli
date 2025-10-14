// @flow
import * as React from 'react';
import useCommit from "@/app/(lang)/[lang]/ai/hooks/useCommit";
import {CommitButtonWithContainer} from "@/app/(lang)/[lang]/ai/components/Commit/CommitButtonWithContainer";


export function Commit() {
    const {headId,onCommit,commits,savingCommit,} = useCommit();
    return(
        <section className="bg-white rounded-2xl shadow p-4 border">
            <h2 className="font-medium mb-3">Commit Timeline</h2>

            {(!commits || commits.length === 0) ? (
                <div className="text-sm text-gray-500">No commits yet. Create one above.</div>
            ) : (
                <ul className="space-y-2">
                    {Object.values(commits)
                        .filter(Boolean) // <- guard against undefined holes
                        .map((c: any) => (
                            <CommitButtonWithContainer key={c.id} type={"li"} commit={c} headId={headId}/>
                        ))}
                </ul>
            )}
        </section>
    )
};