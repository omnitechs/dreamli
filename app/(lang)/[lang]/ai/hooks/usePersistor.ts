import {persistor} from "@/app/store";

export default function usePersistor() {
    const purgePersist = async () => { await persistor.purge(); location.reload(); };
    return {purgePersist}
}