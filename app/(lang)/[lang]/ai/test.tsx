"use client";

import React from "react";
import {CommitsPanel} from "@/app/(lang)/[lang]/ai/components/CommitsPanel";
import {ImageGallery} from "@/app/(lang)/[lang]/ai/components/ImageGallery";
import {ModelsPanel} from "@/app/(lang)/[lang]/ai/components/GeneratorPanel/ModelsPanel";
import {RawGenerator} from "@/app/(lang)/[lang]/ai/components/RawGenerator";
import {Messanger} from "@/app/(lang)/[lang]/ai/components/Messanger";
import {Prompt} from "@/app/(lang)/[lang]/ai/components/Prompt";
import {CommandCenter} from "@/app/(lang)/[lang]/ai/components/CommandCenter";
import Build3DCard from "@/app/(lang)/[lang]/ai/components/GeneratorPanel/Build3DCard";
import ModelsGallery from "@/app/(lang)/[lang]/ai/components/GeneratorPanel/ModelGallery";
import {GeneratorPanel} from "@/app/(lang)/[lang]/ai/components/GeneratorPanel";



type Props ={
    projectId: string,
}
export default function GeneratorPlayground(props:Props): JSX.Element {
    const projectId = props.projectId ?? null;

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            <CommandCenter projectId={projectId}/>
            {/*<CommitsPanel/>*/}
           <Prompt/>
            <ImageGallery/>
            <Messanger/>
            <CommitsPanel/>
            <Build3DCard projectId={projectId}/>
            <ModelsPanel/>
            <ModelsGallery/>
            <GeneratorPanel projectId={projectId}/>
            <RawGenerator/>
        </div>
    );
}
