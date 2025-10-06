// app/components/keychain/cache.ts
export function defHash(obj: any) {
    const s = JSON.stringify(obj);
    let h = 2166136261 >>> 0;
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 16777619) >>> 0;
    }
    return h.toString(36);
}

export function pick<T extends object, K extends readonly (keyof T)[]>(o: T, keys: K): Pick<T, K[number]> {
    const out = {} as any;
    for (const k of keys) out[k] = o[k];
    return out;
}
