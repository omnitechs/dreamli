import {
    addImages,
    removeImage,
    removeSelectedImages,
    setSelected
} from "@/app/(lang)/[lang]/ai/store/slices/generatorSlice";
import {useDispatch} from "react-redux";
import {useCallback, useMemo, useRef} from "react";
import useGenerator from "@/app/(lang)/[lang]/ai/hooks/useGenerator";

export default function useImages(){
    const dispatch = useDispatch();
    const {gen} = useGenerator()
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    // ---------- tools ----------
    const selectAll = () => dispatch(setSelected(gen.images.map((i: any) => i.id)));
    const clearSel = () => dispatch(setSelected([]));
    const removeSelected = () => dispatch(removeSelectedImages());
    const onPickFiles = useCallback(() => fileInputRef.current?.click(), []);
    const handleFiles = useCallback(async (files: FileList | null) => {
        if (!files) return;
        for (const file of Array.from(files)) {
            const tempId = crypto.randomUUID();
            const tempUrl = URL.createObjectURL(file);
            // optimistic add
            dispatch(addImages([{ id: tempId, url: tempUrl, key:"", meta: { name: file.name, size: file.size, type: file.type } }]));
            try {
                // simple dev upload — store to /public/uploads
                const fd = new FormData();
                fd.append('file', file);
                const res = await fetch('/api/uploads/presign', { method: 'POST', body: fd });
                if (!res.ok) throw new Error('upload failed');
                const data = await res.json();
                // swap blob -> public url, keeping same id
                dispatch(addImages([{ id: tempId, url: data.url, key: data.key } as any]));
            } catch {
                dispatch(removeImage(tempId));
            }
        }
    }, [dispatch]);
    const removeImageById = useCallback((id:any) => dispatch(removeImage(id)), [dispatch]);
    const images = gen.images ?? [];
    const selectedCount = (gen.selected ?? []).length;
    const selectedSet = useMemo(() => new Set(gen.selected ?? []), [gen.selected]);
    const selected = gen.selected
    const setSelectedHandler =(sel:any) => {
        dispatch(setSelected(sel));
    }

    return {selectAll,removeImageById,
        clearSel, removeSelected,onPickFiles,handleFiles,fileInputRef,images,selectedCount,selectedSet,selected,setSelectedHandler};
}