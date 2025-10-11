export async function delay(ms: number) {
    return new Promise((res) => setTimeout(res, ms));
}

export async function safeText(res: Response) {
    try { return await res.text(); } catch { return "<no body>"; }
}


export function fileNameFromUrl(u: string) {
    try { return new URL(u).pathname.split("/").pop() || "image.png"; }
    catch { return "image.png"; }
}

// utils/prof.ts
import { performance } from 'node:perf_hooks';
export function prof(label: string) {
    const t0 = performance.now();
    return () => console.log(`[prof] ${label}: ${(performance.now() - t0).toFixed(1)}ms`);
}
