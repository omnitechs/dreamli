import {useDispatch, useSelector} from "react-redux";
import {setMode} from "@/app/(lang)/[lang]/ai/store/slices/generatorSlice";
import useGenerator from "@/app/(lang)/[lang]/ai/hooks/useGenerator";

export default function useMode() {
    const dispatch = useDispatch();
    const {gen} = useGenerator()
    const toggleMode =()=>{
        dispatch(setMode(gen.type === 'text' ? 'image' : 'text'))
    }
    const modeType=gen.type
    return {toggleMode,modeType}
}