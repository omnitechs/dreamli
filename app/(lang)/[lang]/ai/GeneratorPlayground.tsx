"use client";

import React from "react";
import {CommitsPanel} from "@/app/(lang)/[lang]/ai/components/CommitsPanel";
import {Messenger} from "@/app/(lang)/[lang]/ai/components/Messenger";
import {CommandCenter} from "@/app/(lang)/[lang]/ai/components/CommandCenter";
import {GeneratorPanel} from "@/app/(lang)/[lang]/ai/components/GeneratorPanel";
import { useSession } from "next-auth/react";
import AiSessionModelsNavbarClient from "@/app/(lang)/[lang]/ai/AiSessionModelsNavbarClient";


type Props ={
    projectId: string,
}
export default function GeneratorPlayground(props:Props): JSX.Element {
    const projectId = props.projectId ?? null;
    const { data: session } = useSession();

    return (
        <div className="h-full bg-gray-50">
            {((session?.user as any)?.role === 'admin') && (
                <CommandCenter projectId={projectId}/>
            )}
            {/* Desktop 3-pane layout */}
            <div className="hidden xl:grid xl:grid-cols-[280px_minmax(0,0.6fr)_minmax(0,0.4fr)] h-full">
                <CommitsPanel/>
                <Messenger/>
                <GeneratorPanel projectId={projectId}/>
            </div>

            {/* Mobile/tablet stacked layout */}
            <div className="xl:hidden h-full overflow-auto">
                <div className="space-y-6 p-4">
                    <CommitsPanel/>
                    <Messenger/>
                    <GeneratorPanel projectId={projectId}/>
                </div>
            </div>
        </div>
    );
}
