// public/test.scad
// Keychain parts split: base (no ring), text, hole (ring only)
// mode: "base" | "text" | "hole" | "all"

linea1 = is_undef(linea1) ? "Sina" : linea1;
linea2 = is_undef(linea2) ? "Esfahani" : linea2;
fuente = is_undef(fuente) ? "DejaVu Sans:style=Regular" : fuente;

tamanio_texto    = is_undef(tamanio_texto)    ? 12  : tamanio_texto;
altura_texto     = is_undef(altura_texto)     ? 1.5 : altura_texto;   // >0 emboss, <0 engrave
espaciado_lineas = is_undef(espaciado_lineas) ? 1.2 : espaciado_lineas;

grosor_borde      = is_undef(grosor_borde)      ? 3  : grosor_borde;
altura_borde      = is_undef(altura_borde)      ? 3  : altura_borde;
mostrar_anilla    = is_undef(mostrar_anilla)    ? true : mostrar_anilla;
diametro_exterior = is_undef(diametro_exterior) ? 15 : diametro_exterior;
diametro_interior = is_undef(diametro_interior) ? 4  : diametro_interior;
ajuste_x          = is_undef(ajuste_x) ? 0 : ajuste_x;
ajuste_y          = is_undef(ajuste_y) ? 0 : ajuste_y;

mode = is_undef(mode) ? "all" : mode;

module text2d_all() {
    if (len(linea1) > 0)
        translate([0, len(linea2)>0 ? tamanio_texto*espaciado_lineas/2 : 0])
            text(linea1, size=tamanio_texto, font=fuente, halign="center", valign="center");
    if (len(linea2) > 0)
        translate([0,-tamanio_texto*espaciado_lineas/2])
            text(linea2, size=tamanio_texto, font=fuente, halign="center", valign="center");
}

function _textHalfW() = (tamanio_texto * max(len(linea1), len(linea2)) * 0.6) / 2;
function _ringX()     = max(0, _textHalfW()) + diametro_exterior/2 - 1 + ajuste_x;
function _ringY()     = (len(linea2)>0 ? tamanio_texto*espaciado_lineas/2 : 0) + ajuste_y;

// Base plate grown from text outline (no ring)
module base3d_no_ring() {
    difference() {
        linear_extrude(height=altura_borde)
            offset(delta=grosor_borde)
                offset(delta=0)
                    text2d_all();

        // engrave when altura_texto < 0
        if (altura_texto < 0)
            translate([0,0,altura_borde + altura_texto])
                linear_extrude(height=abs(altura_texto)) text2d_all();
    }
}

// Raised text (emboss) or thin preview if engraving
module text3d() {
    if (altura_texto > 0)
        translate([0,0,altura_borde])
            linear_extrude(height=altura_texto) text2d_all();
    else
        translate([0,0,altura_borde])
            linear_extrude(height=1.0) text2d_all();
}

// Ring (hole) as a separate part
module hole3d() {
    if (mostrar_anilla)
        translate([_ringX(), _ringY(), 0])
            difference() {
                cylinder(h=altura_borde, d=diametro_exterior, $fn=64);
                translate([0,0,-1]) cylinder(h=altura_borde+2, d=diametro_interior, $fn=64);
            }
}

if (mode == "base")      base3d_no_ring();
else if (mode == "text") text3d();
else if (mode == "hole") hole3d();
else {
    // ✅ ensure a single solid mesh for the merged STL
    union() {
        base3d_no_ring();
        text3d();
        hole3d();
    }
}
