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
    const [toolsOpen, setToolsOpen] = React.useState(false)

    return (
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Primary actions */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 -mb-1 sm:overflow-visible sm:pb-0 sm:mb-0">
                <button
                    className="px-2 py-1 rounded-xl shadow text-xs border hover:bg-gray-50 whitespace-nowrap sm:px-3 sm:py-2 sm:text-sm"
                    onClick={toggleMode}
                >
                    Mode: {modeType}
                </button>
                <button
                    className="px-2 py-1 rounded-xl shadow text-xs border hover:bg-gray-50 whitespace-nowrap sm:px-3 sm:py-2 sm:text-sm"
                    onClick={onPickFiles}
                >
                    Upload Images
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                />
                <button
                    onClick={() => onCommit(projectId)}
                    disabled={savingCommit}
                    className="px-2 py-1 rounded-xl shadow text-xs border bg-black text-white disabled:opacity-50 whitespace-nowrap sm:px-3 sm:py-2 sm:text-sm"
                >
                    {savingCommit ? 'Saving…' : 'CommitsPanel Snapshot'}
                </button>

                {/* Mobile-only tools toggle */}
                <button
                    className="sm:hidden ml-auto px-2 py-1 rounded-xl shadow text-xs border hover:bg-gray-50 whitespace-nowrap"
                    onClick={() => setToolsOpen((v) => !v)}
                    aria-expanded={toolsOpen}
                    aria-controls="playground-tools"
                >
                    {toolsOpen ? 'Hide Tools' : 'Tools'}
                </button>
            </div>

            {/* Playground tools */}
            <div
                id="playground-tools"
                className={`${toolsOpen ? 'flex' : 'hidden'} flex-wrap gap-2 sm:flex`}
            >
                <span className="hidden sm:inline mx-2 h-6 w-px bg-gray-200 self-center" />
                <button className="px-2 py-1 rounded-xl shadow text-xs border hover:bg-gray-50 sm:px-3 sm:py-2 sm:text-sm" onClick={selectAll}>
                    Select All
                </button>
                <button className="px-2 py-1 rounded-xl shadow text-xs border hover:bg-gray-50 sm:px-3 sm:py-2 sm:text-sm" onClick={clearSel}>
                    Clear Selection
                </button>
                <button className="px-2 py-1 rounded-xl shadow text-xs border hover:bg-gray-50 sm:px-3 sm:py-2 sm:text-sm" onClick={removeSelected}>
                    Remove Selected
                </button>
                <button className="px-2 py-1 rounded-xl shadow text-xs border text-red-600 hover:bg-red-50 sm:px-3 sm:py-2 sm:text-sm" onClick={purgePersist}>
                    Purge Persist
                </button>
            </div>
        </header>
    );
};