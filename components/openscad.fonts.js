// ESM helper for your module worker
// Registers multiple TTFs and exposes a clean list of family strings to use in SCAD/UI.

export const AVAILABLE_FONTS = [
    "DejaVu Sans:style=Book",
    "DejaVu Sans:style=Regular",
    "Noto Sans:style=Regular",
    "Archivo Black",           // (no style suffix; family has single Regular)
    "Bebas Neue",              // (limited diacritics)
    "Pacifico:style=Regular",  // (some diacritics)
];

export async function addFonts(inst) {
    const fonts = [
        { family: "DejaVu Sans",      style: "Book",    file: "/openscad/fonts/DejaVuSans.ttf" },
        { family: "DejaVu Sans",      style: "Regular", file: "/openscad/fonts/DejaVuSans.ttf" },
        { family: "Noto Sans",        style: "Regular", file: "/openscad/fonts/NotoSans-Regular.ttf" },
        { family: "Archivo Black",    style: null,      file: "/openscad/fonts/ArchivoBlack-Regular.ttf" },
        { family: "Bebas Neue",       style: null,      file: "/openscad/fonts/BebasNeue-Regular.ttf" },
        { family: "Pacifico",         style: "Regular", file: "/openscad/fonts/Pacifico-Regular.ttf" },
        { family: "HarmonyOs",         style: "Regular", file: "/openscad/fonts/HarmonyOS_Sans_Black.ttf" },
    ];

    inst.FS.mkdirTree("/usr/share/fonts/truetype");
    inst.FS.mkdirTree("/fonts");

    for (const f of fonts) {
        const res = await fetch(f.file, { cache: "no-store" });
        if (!res.ok) throw new Error(`fetch ${f.file} -> ${res.status}`);
        const bytes = new Uint8Array(await res.arrayBuffer());

        // write in two common search paths
        const baseName = f.file.split("/").pop();
        const p1 = `/usr/share/fonts/truetype/${baseName}`;
        const p2 = `/openscad/fonts/${baseName}`;
        inst.FS.writeFile(p1, bytes);
        inst.FS.writeFile(p2, bytes);

        // Try both registration APIs (depends on build)
        const fam = f.family;
        if (typeof inst.addFont === "function") {
            inst.addFont(p1, fam);
            inst.addFont(p2, fam);
        } else if (typeof inst.registerFont === "function") {
            inst.registerFont(p1, fam);
            inst.registerFont(p2, fam);
        }
    }
}
