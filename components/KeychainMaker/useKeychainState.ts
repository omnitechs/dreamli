// app/components/keychain/useKeychainState.ts
'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Defines, KeychainColors } from './types';

function useDebouncedValue<T>(value: T, delay = 300) {
    const [v, setV] = useState(value);
    useEffect(() => { const id = setTimeout(() => setV(value), delay); return () => clearTimeout(id); }, [value, delay]);
    return v;
}

const ANDROID = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);
const IOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
const MOBILE = ANDROID || IOS;

export function useKeychainState() {
    // fonts
    const [fontList, setFontList] = useState<string[]>([]);
    const [fuente, setFuente] = useState('DejaVu Sans:style=Regular');
    useEffect(() => {
        (async () => {
            try {
                // @ts-ignore
                const mod: any = await import(/* webpackIgnore: true */ '/openscad/openscad.fonts.js');
                const arr: string[] = Array.isArray(mod?.AVAILABLE_FONTS) ? mod.AVAILABLE_FONTS : [];
                const sane = arr.length ? arr : [
                    'DejaVu Sans:style=Regular','DejaVu Sans:style=Book','Noto Sans:style=Regular','Archivo Black','Bebas Neue','Pacifico:style=Regular',
                ];
                setFontList(sane);
                if (!sane.includes(fuente)) setFuente(sane[0]);
            } catch {
                const fallback = [
                    'DejaVu Sans:style=Regular','DejaVu Sans:style=Book','Noto Sans:style=Regular','Archivo Black','Bebas Neue','Pacifico:style=Regular',
                ];
                setFontList(fallback);
                if (!fallback.includes(fuente)) setFuente(fallback[0]);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // text + geometry
    const [linea1, setLinea1] = useState('Sina');
    const [linea2, setLinea2] = useState('Esfahani');
    const [tamanio, setTamanio] = useState(12);
    const [altura, setAltura] = useState(1.5);
    const [alturaBorde, setAlturaBorde] = useState(3);
    const [grosorBorde, setGrosorBorde] = useState(3);
    const [espaciado, setEspaciado] = useState(1.2);
    const [mostrarAnilla, setMostrarAnilla] = useState(true);

    // colors
    const [dosColores, setDosColores] = useState(true);
    const [colors, setColors] = useState<KeychainColors>({
        baseName: 'Morado / Purple',
        textName: 'Verde / Green',
        unicoName: 'Gris Oscuro / Dark Gray',
    });

    // ring
    const [ajusteX, setAjusteX] = useState(0);
    const [ajusteY, setAjusteY] = useState(0);
    const [dExt, setDExt] = useState(15);
    const [dInt, setDInt] = useState(4);

    // viewer mode
    const [freeView, setFreeView] = useState(false);

    // debounced values (lighter redraws)
    const dLinea1 = useDebouncedValue(linea1, MOBILE ? 450 : 300);
    const dLinea2 = useDebouncedValue(linea2, MOBILE ? 450 : 300);
    const dTamanio = useDebouncedValue(tamanio, MOBILE ? 200 : 120);
    const dAltura = useDebouncedValue(altura, MOBILE ? 200 : 120);
    const dAlturaBorde = useDebouncedValue(alturaBorde, 120);
    const dGrosorBorde = useDebouncedValue(grosorBorde, 120);
    const dEspaciado = useDebouncedValue(espaciado, 120);
    const dAjusteX = useDebouncedValue(ajusteX, 120);
    const dAjusteY = useDebouncedValue(ajusteY, 120);
    const dDExt = useDebouncedValue(dExt, 120);
    const dDInt = useDebouncedValue(dInt, 120);

    const defines: Defines = useMemo(
        () => ({
            linea1: dLinea1,
            linea2: dLinea2,
            fuente,
            tamanio_texto: dTamanio,
            altura_texto: dAltura,
            espaciado_lineas: dEspaciado,
            grosor_borde: dGrosorBorde,
            altura_borde: dAlturaBorde,
            mostrar_anilla: mostrarAnilla,
            diametro_exterior: dDExt,
            diametro_interior: dDInt,
            ajuste_x: dAjusteX,
            ajuste_y: dAjusteY,
            dos_colores: dosColores,
            color_unico: colors.unicoName,
            color_base: colors.baseName,
            color_texto: colors.textName,
        }),
        [dLinea1,dLinea2,fuente,dTamanio,dAltura,dEspaciado,dGrosorBorde,dAlturaBorde,dDExt,dDInt,dAjusteX,dAjusteY,mostrarAnilla,dosColores,colors.unicoName,colors.baseName,colors.textName]
    );

    return {
        MOBILE,
        fontList,
        fuenteState: [fuente, setFuente] as const,
        textState: { linea1, setLinea1, linea2, setLinea2, tamanio, setTamanio },
        geoState: { altura, setAltura, alturaBorde, setAlturaBorde, grosorBorde, setGrosorBorde, espaciado, setEspaciado },
        ringState: { ajusteX, setAjusteX, ajusteY, setAjusteY, dExt, setDExt, dInt, setDInt },
        colorState: { dosColores, setDosColores, colors, setColors },
        viewerState: { freeView, setFreeView },
        mostrarAnilla,
        setMostrarAnilla,
        defines,
    };
}
