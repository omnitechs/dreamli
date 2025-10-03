// ESM helper – works with your current `import()`
// /public/openscad/openscad.fonts.js
export async function addFonts(inst) {
    const family = "DejaVu Sans";
    const url = "/openscad/fonts/DejaVuSans.ttf";

    inst.FS.mkdirTree("/usr/share/fonts/truetype");
    inst.FS.mkdirTree("/fonts");

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`fetch ${url} -> ${res.status}`);
    const bytes = new Uint8Array(await res.arrayBuffer());

    // Write TTF to typical search paths
    const p1 = "/usr/share/fonts/truetype/DejaVuSans.ttf";
    const p2 = "/fonts/DejaVuSans.ttf";
    inst.FS.writeFile(p1, bytes);
    inst.FS.writeFile(p2, bytes);

    // Register if the API exists (varies by build)
    if (typeof inst.addFont === "function") {
        inst.addFont(p1, family);
        inst.addFont(p2, family);
    } else if (typeof inst.registerFont === "function") {
        inst.registerFont(p1, family);
        inst.registerFont(p2, family);
    }
}
