// app/components/keychain/types.ts
export type Mode = 'base' | 'text' | 'all';

export type Defines = {
    linea1: string;
    linea2: string;
    fuente: string;
    tamanio_texto: number;
    altura_texto: number;
    espaciado_lineas: number;
    grosor_borde: number;
    altura_borde: number;
    mostrar_anilla: boolean;
    diametro_exterior: number;
    diametro_interior: number;
    ajuste_x: number;
    ajuste_y: number;
    dos_colores: boolean;
    color_unico: string;
    color_base: string;
    color_texto: string;
    mode?: Mode;
};

export type KeychainColors = {
    baseName: string;
    textName: string;
    unicoName: string;
};
