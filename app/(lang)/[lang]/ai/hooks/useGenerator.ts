import {useSelector} from "react-redux";
import type {RootState} from "@/app/store";

export default function useGenerator() {
    const gen = useSelector((s: RootState) => (s as any)?.generator) ?? {
        type: 'text', textPrompt: '', images: [], selected: [],
        approvalSet: [], dirtySinceLastModel: false, messages: [],
    };
    return {gen}
}