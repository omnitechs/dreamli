// app/components/keychain/useKeychainCompile.ts
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Defines } from './types';
import { compileMany } from './openscadClient';

// Group keys by behavior
const TEXT_KEYS = ['linea1','linea2','fuente','tamanio_texto','altura_texto','espaciado_lineas'] as const;
const BASE_KEYS = ['grosor_borde','altura_borde'] as const;
const HOLE_KEYS = ['mostrar_anilla','diametro_exterior','diametro_interior','ajuste_x','ajuste_y','altura_borde'] as const;
const COLOR_KEYS = ['dos_colores','color_unico','color_base','color_texto'] as const;

function hashOf(obj: Record<string, any>, keys: readonly string[]) {
    const o: Record<string, any> = {};
    for (const k of keys) o[k] = obj[k];
    return JSON.stringify(o);
}

type Mode = 'base'|'text'|'hole';

export function useKeychainCompile(params: { scadPath: string; defines: Defines }) {
    const { scadPath, defines } = params;

    const [baseBuf, setBaseBuf] = useState<ArrayBuffer | null>(null);
    const [textBuf, setTextBuf] = useState<ArrayBuffer | null>(null);
    const [holeBuf, setHoleBuf] = useState<ArrayBuffer | null>(null);

    const prevTextHash = useRef<string>('');
    const prevBaseHash = useRef<string>('');
    const prevHoleHash = useRef<string>('');
    const prevColorHash = useRef<string>('');
    const firstRunRef   = useRef(true);

    const nowTextHash  = useMemo(() => hashOf(defines as any, TEXT_KEYS as any), [defines]);
    const nowBaseHash  = useMemo(() => hashOf(defines as any, BASE_KEYS as any), [defines]);
    const nowHoleHash  = useMemo(() => hashOf(defines as any, HOLE_KEYS as any), [defines]);
    const nowColorHash = useMemo(() => hashOf(defines as any, COLOR_KEYS as any), [defines]);

    useEffect(() => {
        const textChanged  = firstRunRef.current || prevTextHash.current !== nowTextHash;
        const baseChanged  = firstRunRef.current || prevBaseHash.current !== nowBaseHash;
        const holeChanged  = firstRunRef.current || prevHoleHash.current !== nowHoleHash;
        const colorChanged = firstRunRef.current ? false : prevColorHash.current !== nowColorHash;

        // update refs for next run
        prevTextHash.current  = nowTextHash;
        prevBaseHash.current  = nowBaseHash;
        prevHoleHash.current  = nowHoleHash;
        prevColorHash.current = nowColorHash;

        // determine which modes to compile
        const modes: Mode[] = [];

        if (!textChanged && !baseChanged && !holeChanged && colorChanged) {
            // colors only → no compile
        } else {
            if (textChanged || baseChanged) {
                modes.push('base','text');
            }
            if (holeChanged) {
                modes.push('hole');
            }
        }

        if (modes.length === 0) {
            firstRunRef.current = false;
            return;
        }

        const uniqueModes = Array.from(new Set(modes)) as Mode[];
        compileMany(scadPath, defines, uniqueModes).then((r: any) => {
            if (uniqueModes.includes('base')) setBaseBuf(r.base ?? null);
            if (uniqueModes.includes('text')) setTextBuf(r.text ?? null);
            if (uniqueModes.includes('hole')) setHoleBuf(r.hole ?? null);
        }).finally(() => {
            firstRunRef.current = false;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scadPath, defines, nowTextHash, nowBaseHash, nowHoleHash, nowColorHash]);

    return { baseBuf, textBuf, holeBuf };
}
