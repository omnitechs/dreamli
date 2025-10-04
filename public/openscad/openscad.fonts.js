// Registers TTFs into the WASM FS and maps multiple names (family and family:style=...)
// so text(font="...") matches exactly what your UI sends.

export const AVAILABLE_FONTS = [
    "DejaVu Sans:style=Book",
    "DejaVu Sans:style=Regular",
    "Noto Sans:style=Regular",
    "Archivo Black",
    "Bebas Neue",
    "Pacifico:style=Regular",
    "HarmonyOs:style=Black"
];

export async function addFonts(inst) {
    const specs = [
        {
            family: "DejaVu Sans",
            style:  "Book",
            file:   "/openscad/fonts/DejaVuSans.ttf",
            // DejaVuSans.ttf often reports Book/Regular from the same file → map both
            aliases: ["DejaVu Sans", "DejaVu Sans:style=Book", "DejaVu Sans:style=Regular"]
        },
        {
            family: "Noto Sans",
            style:  "Regular",
            file:   "/openscad/fonts/NotoSans-Regular.ttf",
            aliases: ["Noto Sans", "Noto Sans:style=Regular"]
        },
        {
            family: "Archivo Black",
            style:  null,
            file:   "/openscad/fonts/ArchivoBlack-Regular.ttf",
            aliases: ["Archivo Black"]
        },
        {
            family: "Bebas Neue",
            style:  null,
            file:   "/openscad/fonts/BebasNeue-Regular.ttf",
            aliases: ["Bebas Neue"]
        },
        {
            family: "Pacifico",
            style:  "Regular",
            file:   "/openscad/fonts/Pacifico-Regular.ttf",
            aliases: ["Pacifico", "Pacifico:style=Regular"]
        },
        {
            // The file is HarmonyOS_Sans_Black.ttf, family metadata is typically "HarmonyOS Sans"
            // Your UI uses "HarmonyOs:style=Black" → register both spellings.
            family: "HarmonyOS Sans",
            style:  "Black",
            file:   "/openscad/fonts/HarmonyOS_Sans_Black.ttf",
            aliases: ["HarmonyOS Sans", "HarmonyOS Sans:style=Black", "HarmonyOs", "HarmonyOs:style=Black"]
        }
    ];

    // Standard font search paths (used by some OpenSCAD builds)
    inst.FS.mkdirTree("/usr/share/fonts/truetype");
    inst.FS.mkdirTree("/fonts");

    for (const f of specs) {
        try {
            const res = await fetch(f.file, { cache: "no-store" });
            if (!res.ok) throw new Error(`fetch ${f.file} -> HTTP ${res.status}`);
            const bytes = new Uint8Array(await res.arrayBuffer());

            const base = f.file.split("/").pop();
            const p1 = `/usr/share/fonts/truetype/${base}`;
            const p2 = `/fonts/${base}`;                    // NOTE: use /fonts (not /openscad/fonts)
            inst.FS.writeFile(p1, bytes);
            inst.FS.writeFile(p2, bytes);

            // Register every alias so text(font="family[:style=...]") resolves 1:1
            for (const name of f.aliases) {
                if (typeof inst.addFont === "function") {
                    inst.addFont(p1, name); inst.addFont(p2, name);
                } else if (typeof inst.registerFont === "function") {
                    inst.registerFont(p1, name); inst.registerFont(p2, name);
                }
            }

            inst.print?.(`[fonts] registered: ${f.aliases.join(", ")}`);
        } catch (err) {
            inst.printErr?.(`[fonts] failed: ${f.family}${f.style ? " ("+f.style+")" : ""} – ${String(err)}`);
            // continue loading the rest
        }
    }
}
