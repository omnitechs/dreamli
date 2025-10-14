// @flow
import * as React from 'react';
import {Commit as CommitType} from "@/app/(lang)/[lang]/ai/store/slices/commitsSlice";
import {CommitButton} from "@/app/(lang)/[lang]/ai/components/Commit/CommitButton";

type Props = {
    type: "div" | "li"
    commit: CommitType
    headId: string
};

export function CommitButtonWithContainer(props: Props) {
    const {type, commit, headId} = props;
    if (type === "div") {
        return (<div key={commit.id} className={`${commit.id === headId ? "bg-gray-50" : ""}`}>
            <CommitButton commit={commit}/>
        </div>)
    } else {
        return (<li key={commit.id} className={`${commit.id === headId ? "bg-gray-50" : ""}`}>
            <CommitButton commit={commit}/>
        </li>)
    }
};