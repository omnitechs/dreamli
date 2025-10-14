"use client";

import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {Commit} from "@/app/(lang)/[lang]/ai/components/Commit";
import {ImageGallery} from "@/app/(lang)/[lang]/ai/components/ImageGallery";
import {ModelsPanel} from "@/app/(lang)/[lang]/ai/components/ModelsPanel";
import useImages from "@/app/(lang)/[lang]/ai/hooks/useImages";
import useCommit from "@/app/(lang)/[lang]/ai/hooks/useCommit";
import useMessage from "@/app/(lang)/[lang]/ai/hooks/useMessage";
import usePersistor from "@/app/(lang)/[lang]/ai/hooks/usePersistor";
import useMode from "@/app/(lang)/[lang]/ai/hooks/useMode";
import usePrompt from "@/app/(lang)/[lang]/ai/hooks/usePrompt";
import {RawGenerator} from "@/app/(lang)/[lang]/ai/components/RawGenerator";
import {Messanger} from "@/app/(lang)/[lang]/ai/components/Messanger";
import {Prompt} from "@/app/(lang)/[lang]/ai/components/Prompt";
import {CommandCenter} from "@/app/(lang)/[lang]/ai/components/CommandCenter";


type Props ={
    projectId: string,
}
export default function GeneratorPlayground(props:Props): JSX.Element {
    const projectId = props.projectId ?? null;

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            <CommandCenter projectId={projectId}/>
           <Prompt/>
            <ImageGallery/>
            <Messanger/>
            <Commit/>
            <ModelsPanel/>
            <RawGenerator/>
        </div>
    );
}
