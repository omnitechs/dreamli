// app/components/keychain/types.ts
export type Mode = 'base' | 'text' | 'hole' | 'all';

export type KeychainColors = {
    baseName: string;
    textName: string;
    unicoName: string; // single-color or the ring (hole) color
};

export type Defines = {
    linea1: string;
    linea2: string;
    fuente: string;

    tamanio_texto: number;
    altura_texto: number;       // >0 emboss, <0 engrave
    espaciado_lineas: number;

    grosor_borde: number;
    altura_borde: number;

    mostrar_anilla: boolean;
    diametro_exterior: number;
    diametro_interior: number;
    ajuste_x: number;
    ajuste_y: number;

    // viewer-only (passed to SCAD anyway for completeness)
    dos_colores: boolean;
    color_unico: string;
    color_base: string;
    color_texto: string;
};
