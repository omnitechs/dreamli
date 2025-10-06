const COLOR_MAP: Record<string, string> = {
    'Rojo / Red': '#ff0000',
    'Rojo Oscuro / Dark Red': '#990000',
    'Verde / Green': '#00ff00',
    'Verde Oscuro / Dark Green': '#009900',
    'Azul / Blue': '#0000ff',
    'Azul Oscuro / Dark Blue': '#000099',
    'Amarillo / Yellow': '#ffff00',
    'Naranja / Orange': '#ff8000',
    'Morado / Purple': '#800080',
    'Rosa / Pink': '#ff66b2',
    'Blanco / White': '#ffffff',
    'Negro / Black': '#000000',
    'Gris Claro / Light Gray': '#CCCCCC',
    'Gris Oscuro / Dark Gray': '#4D4D4D',
    'Turquesa / Turquoise': '#00cccc',
};
export function colorHex(name: string) { return COLOR_MAP[name] ?? '#999999'; }
export const COLOR_OPTIONS = Object.keys(COLOR_MAP);
