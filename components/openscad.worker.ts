/// <reference lib="webworker" />

type MsgIn = {
    scadPath: string;                           // e.g. "/first.scad" (must be reachable via fetch)
    defines: Record<string, string | number | boolean>;
    outName?: string;                           // default "out.stl"
};
type MsgOutOk   = { ok: true; stl: Uint8Array; logs: string[] };
type MsgOutErr  = { ok: false; error: string; logs: string[] };
type MsgOut = MsgOutOk | MsgOutErr;

const ctx: DedicatedWorkerGlobalScope = self as any;

const BASE = "/openscad"; // maps to /public/openscad

async function importFromPublic(path: string) {
    return await import(/* webpackIgnore: true */ path);
}

ctx.onmessage = async (e: MessageEvent<MsgIn>) => {
    const logs: string[] = [];
    function log(...a: any[])     { logs.push(a.join(" ")); }
    function logErr(...a: any[])  { logs.push("[err] " + a.join(" ")); }

    try {
        const { scadPath, defines, outName = "out.stl" } = e.data;

        // Load OpenSCAD factory
        const mod: any = await importFromPublic(`${BASE}/openscad.js`);
        const create = typeof mod?.default === "function" ? mod.default : mod;
        if (typeof create !== "function") throw new Error("openscad.js default export is not a function");
        console.log("here");
        // Optional fonts helper
        let addFonts: ((inst: any) => void | Promise<void>) | null = null;
        try {
            const fontsMod: any = await importFromPublic(`${BASE}/openscad.fonts.js`);
            if (typeof fontsMod?.addFonts === "function") addFonts = fontsMod.addFonts;
        } catch { /* ok if missing */ }

        // Init Emscripten module with log capture
        const instance = await create({
            noInitialRun: true,
            locateFile: (p: string) => `${BASE}/${p}`,
            print: (...a: any[])    => log(...a),
            printErr: (...a: any[]) => logErr(...a),
        });

        // Load fonts (async) BEFORE compiling
        if (addFonts) {
            try {
                const maybe = addFonts(instance);
                if (maybe && typeof (maybe as any).then === "function") {
                    await (maybe as Promise<void>);
                }
                log("[fonts] loaded");
            } catch (fe) {
                logErr("[fonts] failed:", String(fe));
            }
        } else {
            log("[fonts] helper not present (ok if you don't use text())");
        }
        console.log("here");
        // Fetch SCAD into virtual FS
        const INPUT = "/input.scad";
        const res = await fetch(scadPath, { cache: "no-store" });
        if (!res.ok) throw new Error(`fetch ${scadPath} -> HTTP ${res.status}`);
        const scadText = await res.text();
        instance.FS.writeFile(INPUT, scadText);
        log("[fs] wrote", INPUT, `(${scadText.length} chars)`);

        // Build args & compile
        const OUT = `/${outName}`;
        const args: string[] = [INPUT, "-o", OUT];

        for (const [k, v] of Object.entries(defines)) {
            args.push("-D", `${k}=${typeof v === "string" ? JSON.stringify(v) : String(v)}`);
        }
        console.log("here");
        log("[cmd] openscad", args.join(" "));

        try {
            instance.callMain(args);
            log("[compile] done");
        } catch (err: any) {
            console.log("what?",err);
            // Emscripten throws ExitStatus on non-zero exit
            const name = err?.name || "";
            const status = (err && typeof err.status === "number") ? err.status : undefined;

            if (name === "ExitStatus" || name === "Exit") {
                logErr(`[compile] exited with status`, String(status ?? "unknown"));
                // NOTE: do NOT rethrow; we want to continue so we can inspect FS / logs
            } else {
                logErr("[compile] crash:", String(err?.message || err));
            }
        }
        console.log("here");
        // Verify output exists
        let stl: Uint8Array | null = null;
        try {
            stl = instance.FS.readFile(OUT);
            log("[fs] read", OUT, `(${stl.byteLength} bytes)`);
        } catch (re) {
            logErr("[fs] read failed:", String(re));
        }

        if (!stl || !stl.byteLength) {
            // Try to detect common issues
            const hint = [
                "Compilation produced no STL.",
                "- Check font family names in your SCAD (use 'Archivo Black', 'Bebas Neue', etc.).",
                "- Confirm fonts actually loaded (look for [fonts] loaded).",
                "- Open the SCAD URL in browser to confirm it exists."
            ].join(" ");
            ctx.postMessage({ ok: false, error: hint, logs } as MsgOutErr);
            return;
        }


        // Success
        ctx.postMessage({ ok: true, stl, logs } as MsgOutOk, [stl.buffer]);

    } catch (err: any) {
        ctx.postMessage({ ok: false, error: String(err?.message ?? err), logs: [] } as MsgOutErr);
    }
};
