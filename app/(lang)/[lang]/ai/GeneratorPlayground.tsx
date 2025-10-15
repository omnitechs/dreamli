"use client";

import React from "react";
import {CommitsPanel} from "@/app/(lang)/[lang]/ai/components/CommitsPanel";
import {Messenger} from "@/app/(lang)/[lang]/ai/components/Messenger";
import {CommandCenter} from "@/app/(lang)/[lang]/ai/components/CommandCenter";
import {GeneratorPanel} from "@/app/(lang)/[lang]/ai/components/GeneratorPanel";



type Props ={
    projectId: string,
}
export default function GeneratorPlayground(props:Props): JSX.Element {
    const projectId = props.projectId ?? null;

    return (
        <div className="min-h-screen bg-gray-50">
            <CommandCenter projectId={projectId}/>
            {/* Desktop 3-pane layout */}
            <div className="hidden xl:grid xl:grid-cols-[280px_minmax(0,0.7fr)_minmax(0,1fr)] min-h-screen">
                <CommitsPanel/>
                <Messenger/>
                <GeneratorPanel projectId={projectId}/>
            </div>

            {/* Mobile/tablet stacked layout */}
            <div className="xl:hidden">
                <div className="space-y-6 p-4">
                    <CommitsPanel/>
                    <Messenger/>
                    <GeneratorPanel projectId={projectId}/>
                </div>
            </div>
        </div>
    );
}
