/// <reference lib="webworker" />

// Types
// @ts-ignore
type MsgIn = {
    scadPath: string;
    defines: Record<string, string | number | boolean>;
    outName?: string;
};

type MsgOutOk = { ok: true; stl: Uint8Array; logs: string[] };
type MsgOutErr = { ok: false; error: string; logs: string[] };
type MsgOut = MsgOutOk | MsgOutErr;

// Worker globals
const ctx: DedicatedWorkerGlobalScope = self as any;
const BASE = "/openscad";

let instancePromise: Promise<any> | null = null;
let fontsLoaded = false;
const scadCache = new Map<string, string>();

// Utilities
// @ts-ignore
async function importFromPublic(path: string) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return await import(/* webpackIgnore: true */ path);
}

async function getInstance(
    log: (...a: any[]) => void,
    logErr: (...a: any[]) => void
) {
    if (!instancePromise) {
        instancePromise = (async () => {
            const mod: any = await importFromPublic(`${BASE}/openscad.js`);
            const create = typeof mod?.default === "function" ? mod.default : mod;
            if (typeof create !== "function") {
                throw new Error("openscad.js default export is not a function");
            }
            return await create({
                noInitialRun: true,
                locateFile: (p: string) => `${BASE}/${p}`,
                print: (...a: any[]) => log(...a),
                printErr: (...a: any[]) => logErr(...a),
            });
        })();
    }

    const inst = await instancePromise;

    if (!fontsLoaded) {
        try {
            const fontsMod: any = await importFromPublic(`${BASE}/openscad.fonts.js`);
            if (typeof fontsMod?.addFonts === "function") {
                await fontsMod.addFonts(inst);
                log("[fonts] loaded");
            } else {
                log("[fonts] helper not present");
            }
        } catch (e: any) {
            logErr("[fonts] failed to import:", String(e));
        }
        fontsLoaded = true;
    }

    return inst;
}

// Message handler
ctx.onmessage = async (e: MessageEvent<MsgIn>) => {
    const logs: string[] = [];
    const log = (...a: any[]) => logs.push(a.join(" "));
    const logErr = (...a: any[]) => logs.push("[err] " + a.join(" "));

    try {
        const { scadPath, defines, outName = "out.stl" } = e.data;
        const inst = await getInstance(log, logErr);

        // Load SCAD (cache by path)
        let scadText = scadCache.get(scadPath) || "";
        if (!scadText) {
            const res = await fetch(scadPath, { cache: "no-store" });
            if (!res.ok) throw new Error(`fetch ${scadPath} -> HTTP ${res.status}`);
            scadText = await res.text();
            scadCache.set(scadPath, scadText);
        }

        const INPUT = "/input.scad";
        inst.FS.writeFile(INPUT, scadText);
        log("[fs] wrote", INPUT, `(${scadText.length} chars)`);

        const OUT = `/${outName}`;

        // Build CLI args
        const args: string[] = [INPUT, "-o", OUT];
        for (const [k, v] of Object.entries(defines)) {
            const value =
                typeof v === "string" ? JSON.stringify(v) : String(v as any);
            args.push("-D", `${k}=${value}`);
        }

        log("[cmd] openscad", args.join(" "));

        try {
            inst.callMain(args);
            log("[compile] done");
        } catch (err: any) {
            const name = err?.name || "";
            const status =
                err && typeof err.status === "number" ? err.status : undefined;
            if (name === "ExitStatus" || name === "Exit") {
                logErr("[compile] exited with status", String(status ?? "unknown"));
            } else {
                logErr("[compile] crash:", String(err?.message || err));
            }
        }

        // Read STL
        let stl: Uint8Array | null = null;
        try {
            stl = inst.FS.readFile(OUT);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            log("[fs] read", OUT, `(${stl.byteLength} bytes)`);
        } catch (re) {
            logErr("[fs] read failed:", String(re));
        }

        if (!stl || !stl.byteLength) {
            ctx.postMessage({ ok: false, error: "No STL produced.", logs } as MsgOutErr);
            return;
        }

        // Transfer STL buffer
        ctx.postMessage({ ok: true, stl, logs } as MsgOutOk, [stl.buffer]);
    } catch (err: any) {
        ctx.postMessage({
            ok: false,
            error: String(err?.message ?? err),
            logs: [],
        } as MsgOutErr);
    }
};
