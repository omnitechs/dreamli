import {useState} from "react";
import {addMessage} from "@/app/(lang)/[lang]/ai/store/slices/generatorSlice";
import {useDispatch} from "react-redux";

export default function useMessage() {
    const dispatch = useDispatch();
    const [msgRole, setMsgRole] = useState<'user' | 'assistant' | 'system'>('user');
    const [msgText, setMsgText] = useState('');
    const addMsg = () => {
        if (!msgText.trim()) return;
        const id = crypto.randomUUID();
        // const attachments = (gen.selected ?? []).map((imageId: string) => ({ type: 'image', imageId })) as any;
        dispatch(addMessage({
            id, role: msgRole, content: msgText.trim(),
            createdAt: new Date().toISOString(),
        }));
        setMsgText('');
    };
    return {msgRole, msgText,setMsgText,setMsgRole,addMsg};
}