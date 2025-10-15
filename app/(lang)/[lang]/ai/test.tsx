"use client";

import React from "react";
import {CommitsPanel} from "@/app/(lang)/[lang]/ai/components/CommitsPanel";
import {ImageGallery} from "@/app/(lang)/[lang]/ai/components/ImageGallery";
import {ModelsPanel} from "@/app/(lang)/[lang]/ai/components/GeneratorPanel/ModelsPanel";
import {RawGenerator} from "@/app/(lang)/[lang]/ai/components/RawGenerator";
import {Messenger} from "@/app/(lang)/[lang]/ai/components/Messenger";
import {Prompt} from "@/app/(lang)/[lang]/ai/components/Prompt";
import {CommandCenter} from "@/app/(lang)/[lang]/ai/components/CommandCenter";
import Build3DCard from "@/app/(lang)/[lang]/ai/components/GeneratorPanel/Build3DCard";
import ModelsGallery from "@/app/(lang)/[lang]/ai/components/GeneratorPanel/ModelGallery";
import {GeneratorPanel} from "@/app/(lang)/[lang]/ai/components/GeneratorPanel";
import {MessagesPanel} from "@/app/(lang)/[lang]/projects/[projectId]/components/MessagesPanel";
import type {GeneratorSnapshot} from "@/app/(lang)/[lang]/projects/classes/interface";



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
                <CommitsPanel

                />
                <Messenger/>

                <GeneratorPanel projectId={projectId}

                />
            </div>

            {/* Mobile/tablet stacked layout */}
            <div className="xl:hidden">
                <div className="space-y-6 p-4">
                    <CommitsPanel
                    />

                    {/*<MessagesPanel*/}
                    <Messenger/>
                    {/*/>*/}

                    <GeneratorPanel projectId={projectId}
                    />
                </div>
            </div>
        </div>
    );
}
