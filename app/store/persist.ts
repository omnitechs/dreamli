// Avoid the name "PartialState" (collides with RTK generics)
const STORAGE_KEY = 'dreamli:redux:v1';
const SAVE_DEBOUNCE_MS = 300;

const hasWindow = () => typeof window !== 'undefined';

export function loadState<T = unknown>(): T | undefined {
    if (!hasWindow()) return undefined;
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return undefined;
        return JSON.parse(raw) as T;
    } catch {
        return undefined;
    }
}

// Keep this untyped to avoid circular deps; callers can type the return.
function pickPersisted(state: any) {
    return {
        generator: state.generator,
        commits: state.commits,
    };
}

let timer: any = null;
export function scheduleSave(state: any) {
    if (!hasWindow()) return;
    clearTimeout(timer);
    timer = setTimeout(() => {
        try {
            const toSave = pickPersisted(state);
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
        } catch {
            // ignore
        }
    }, SAVE_DEBOUNCE_MS);
}
