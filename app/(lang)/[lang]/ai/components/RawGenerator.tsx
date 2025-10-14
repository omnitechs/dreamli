// @flow
import * as React from 'react';
import useGenerator from "@/app/(lang)/[lang]/ai/hooks/useGenerator";

type Props = {};

export function RawGenerator(props: Props) {
    const {gen} = useGenerator()
    return (

        <details className="bg-white rounded-2xl shadow p-4 border" open>
            <summary className="cursor-pointer font-medium">Debug: Generator JSON</summary>
            <pre className="text-xs overflow-auto mt-2 p-3 bg-gray-50 rounded-xl border">
                {JSON.stringify(gen, null, 2)}
            </pre>
        </details>
    );
};