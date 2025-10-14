import {updateText} from "@/app/(lang)/[lang]/ai/store/slices/generatorSlice";
import {useDispatch} from "react-redux";
import useGenerator from "@/app/(lang)/[lang]/ai/hooks/useGenerator";

export default function usePrompt() {
    const dispatch = useDispatch();
    const {gen} = useGenerator()
    const updatePrompt = (text:string) => {
        dispatch(updateText(text))
    }
    const prompt = gen.textPrompt
    return {updatePrompt, prompt}
}