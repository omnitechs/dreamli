import {persistor} from "@/app/(lang)/[lang]/ai/store";

export default function usePersistor() {
    const purgePersist = async () => { await persistor.purge(); location.reload(); };
    return {purgePersist}
}