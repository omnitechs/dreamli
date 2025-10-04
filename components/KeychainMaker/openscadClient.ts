// app/components/keychain/openscadClient.ts
import type { Defines, Mode } from './types';

export function compilePart(scadPath: string, defines: Defines, mode: Mode) {
    return new Promise<ArrayBuffer>((resolve) => {
        const w = new Worker(new URL('./openscad.worker.ts', import.meta.url), { type: 'module' });
        w.onmessage = (e: MessageEvent<any>) => {
            if (!e.data?.ok) {
                console.error('OpenSCAD error:', e.data?.error, e.data?.logs);
                w.terminate();
                resolve(new ArrayBuffer(0));
                return;
            }
            const buf: ArrayBuffer =
                e.data.stl instanceof ArrayBuffer ? e.data.stl : (e.data.stl as Uint8Array).buffer;
            w.terminate();
            resolve(buf);
        };
        w.postMessage({ scadPath, outName: `${mode}.stl`, defines: { ...defines, mode } });
    });
}
