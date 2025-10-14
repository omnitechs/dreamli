import {useState} from "react";
import {addMessage,clearMessages,removeMessage} from "@/app/(lang)/[lang]/ai/store/slices/generatorSlice";
import {useDispatch, useSelector} from "react-redux";
import useGenerator from "@/app/(lang)/[lang]/ai/hooks/useGenerator";

export default function useMessage() {
    const dispatch = useDispatch();
    const [msgRole, setMsgRole] = useState<'user' | 'assistant' | 'system'>('user');
    const [msgText, setMsgText] = useState('');
    const {gen} = useGenerator()
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
    const clearMessage =()=>{
        dispatch(clearMessages())
    }
    const removeMessageById =(id:string)=>{
        dispatch(removeMessage(id))
    }
    const messages = gen.messages;
    return {msgRole, msgText,setMsgText,setMsgRole,addMsg,clearMessage,messages,removeMessageById};
}