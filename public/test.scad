// --- Fast, WASM-friendly keychain (base from text + attached ring) ---

$fa = 20; $fs = 1.6; $fn = 0;

// ---------------- PARAMS ----------------
linea1 = is_undef(linea1) ? "Alberto" : linea1;
linea2 = is_undef(linea2) ? "Nic"     : linea2;
fuente = is_undef(fuente) ? "DejaVu Sans:style=Book" : fuente;

tamanio_texto    = is_undef(tamanio_texto)    ? 12  : tamanio_texto;
altura_texto     = is_undef(altura_texto)     ? 1.5 : altura_texto;  // >0 emboss, <0 engrave
espaciado_lineas = is_undef(espaciado_lineas) ? 1.2 : espaciado_lineas;

grosor_borde      = is_undef(grosor_borde)      ? 3  : grosor_borde;
altura_borde      = is_undef(altura_borde)      ? 3  : altura_borde;
mostrar_anilla    = is_undef(mostrar_anilla)    ? true : mostrar_anilla;
diametro_exterior = is_undef(diametro_exterior) ? 11 : diametro_exterior;
diametro_interior = is_undef(diametro_interior) ? 4  : diametro_interior;
ajuste_x          = is_undef(ajuste_x) ? 0 : ajuste_x;
ajuste_y          = is_undef(ajuste_y) ? 0 : ajuste_y;

// Which solid to emit (for two-pass STL in the viewer)
mode = is_undef(mode) ? "all" : mode;   // "base" | "text" | "all"

// ---------------- TEXT 2D ----------------
module text2d_all() {
  if (len(linea1) > 0)
    translate([0, len(linea2)>0 ? tamanio_texto*espaciado_lineas/2 : 0])
      text(linea1, size=tamanio_texto, font=fuente, halign="center", valign="center");
  if (len(linea2) > 0)
    translate([0,-tamanio_texto*espaciado_lineas/2])
      text(linea2, size=tamanio_texto, font=fuente, halign="center", valign="center");
}

// ---------------- RING POSITION HELPERS ----------------
function _textHalfW() = (tamanio_texto * max(len(linea1), len(linea2)) * 0.6) / 2;
function _ringX() = max(0, _textHalfW()) + diametro_exterior/2 - 1 + ajuste_x;
function _ringY() = (len(linea2)>0 ? tamanio_texto*espaciado_lineas/2 : 0) + ajuste_y;

// ---------------- BASE 2D (text outline + ring + connector) ----------------
module base2d_from_text() {
  union() {
    // text-grown outline (fast replacement for minkowski)
    offset(delta=grosor_borde) offset(delta=0) union() text2d_all();

    if (mostrar_anilla) {
      // ring donut
      translate([_ringX(), _ringY()])
        difference() { circle(d=diametro_exterior,$fn=50); circle(d=diametro_interior,$fn=50); }

      // connector bridge from text outline to ring
      hull() {
        // approx right edge of grown text
        translate([_textHalfW() + grosor_borde*0.6, _ringY()]) circle(d=grosor_borde, $fn=24);
        // left edge of ring
        translate([_ringX() - diametro_exterior/2 + grosor_borde*0.6, _ringY()]) circle(d=grosor_borde, $fn=24);
      }
    }
  }
}

// ---------------- 3D SOLIDS ----------------
module solid_base() {
  difference() {
    // Base body
    linear_extrude(height=altura_borde) base2d_from_text();

    // Drill the ring hole through the body
    if (mostrar_anilla)
      translate([_ringX(), _ringY(), -1])
        cylinder(h=altura_borde + abs(altura_texto) + 2, d=diametro_interior, $fn=50);

    // Engrave text if negative altura_texto
    if (altura_texto < 0)
      translate([0,0,altura_borde + altura_texto])
        linear_extrude(height=abs(altura_texto)) text2d_all();
  }
}

module solid_text() {
  // Embossed text (or thin standalone if altura_texto <= 0),
  // lifted slightly to avoid z-fighting with base top.
  translate([0,0,max(0,altura_borde)])
    linear_extrude(height=(altura_texto>0 ? altura_texto : 1.2))
      text2d_all();
}

// ---------------- OUTPUT SELECTOR ----------------
if (mode == "base")      solid_base();
else if (mode == "text") solid_text();
else {                   solid_base(); solid_text(); }
