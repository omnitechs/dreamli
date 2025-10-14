// @flow
import * as React from 'react';
import useMode from "@/app/(lang)/[lang]/ai/hooks/useMode";
import useCommit from "@/app/(lang)/[lang]/ai/hooks/useCommit";
import useImages from "@/app/(lang)/[lang]/ai/hooks/useImages";
import usePersistor from "@/app/(lang)/[lang]/ai/hooks/usePersistor";

type Props = {
    projectId: string,
};

export function CommandCenter(props: Props) {
    const {projectId} = props;
    const {toggleMode,modeType} = useMode()
    const {onCommit,savingCommit} = useCommit();
    const {purgePersist} = usePersistor()
    const {onPickFiles,handleFiles,fileInputRef,removeSelected,selectAll,clearSel,selectedCount,images} = useImages()

    return (
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-semibold">Generator Playground</h1>
            <div className="flex flex-wrap gap-2">
                <button className="px-3 py-2 rounded-xl shadow text-sm border hover:bg-gray-50"
                        onClick={toggleMode}>
                    Mode: {modeType}
                </button>
                <button className="px-3 py-2 rounded-xl shadow text-sm border hover:bg-gray-50" onClick={onPickFiles}>
                    Upload Images
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
                       onChange={(e) => handleFiles(e.target.files)} />
                <button onClick={()=>onCommit(projectId)} disabled={savingCommit}
                        className="px-3 py-2 rounded-xl shadow text-sm border bg-black text-white disabled:opacity-50">
                    {savingCommit ? 'Saving…' : 'CommitsPanel Snapshot'}
                </button>

                {/* Playground tools */}
                <span className="mx-2 h-6 w-px bg-gray-200 self-center" />
                <button className="px-3 py-2 rounded-xl shadow text-sm border hover:bg-gray-50" onClick={selectAll}>
                    Select All
                </button>
                <button className="px-3 py-2 rounded-xl shadow text-sm border hover:bg-gray-50" onClick={clearSel}>
                    Clear Selection
                </button>
                <button className="px-3 py-2 rounded-xl shadow text-sm border hover:bg-gray-50" onClick={removeSelected}>
                    Remove Selected
                </button>
                <button className="px-3 py-2 rounded-xl shadow text-sm border text-red-600 hover:bg-red-50" onClick={purgePersist}>
                    Purge Persist
                </button>
            </div>
        </header>
    );
};