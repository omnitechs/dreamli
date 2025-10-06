// app/components/keychain/KeychainBuilder.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import { useKeychainState } from './useKeychainState';
import { COLOR_OPTIONS } from './colors';
import { useKeychainThree } from './useKeychainThree';
import { useKeychainCompile } from './useKeychainCompile';

type Props = { scadPath?: string; className?: string; };

export default function KeychainBuilder({ scadPath = '/test.scad', className = '' }: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const {
        MOBILE, fontList, fuenteState, textState, geoState, ringState,
        colorState, viewerState, defines, mostrarAnilla, setMostrarAnilla,
    } = useKeychainState();

    const [fuente, setFuente] = fuenteState;
    const { linea1, setLinea1, linea2, setLinea2, tamanio, setTamanio } = textState;
    const { altura, setAltura, alturaBorde, setAlturaBorde, grosorBorde, setGrosorBorde, espaciado, setEspaciado } = geoState;
    const { ajusteX, setAjusteX, ajusteY, setAjusteY, dExt, setDExt, dInt, setDInt } = ringState;
    const { dosColores, setDosColores, colors, setColors } = colorState;
    const { freeView, setFreeView } = viewerState;

    const three = useKeychainThree({
        containerRef,
        defines,
        scadPath,
        freeView,
        MOBILE,
        colorNames: { base: colors.baseName, text: colors.textName, unico: colors.unicoName },
    });
    const { switchTo, setPartGeometry, setColors: viewerSetColors } = three;

    // smart compiles (parallel workers under the hood)
    const { baseBuf, textBuf, holeBuf } = useKeychainCompile({ scadPath, defines });

    // swap geometries per part
    useEffect(() => { if (baseBuf && baseBuf.byteLength) setPartGeometry('base', baseBuf); }, [baseBuf, setPartGeometry]);
    useEffect(() => { if (textBuf && textBuf.byteLength) setPartGeometry('text', textBuf); }, [textBuf, setPartGeometry]);
    useEffect(() => { if (holeBuf && holeBuf.byteLength) setPartGeometry('hole', holeBuf); }, [holeBuf, setPartGeometry]);

    // color-only updates
    useEffect(() => {
        viewerSetColors({
            base: colors.baseName,
            text: colors.textName,
            unico: colors.unicoName,
            twoColors: dosColores,
        });
    }, [colors.baseName, colors.textName, colors.unicoName, dosColores, viewerSetColors]);

    return (
        <section className={`max-w-4xl mx-auto p-6 space-y-6 ${className}`}>
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Keychain Builder</h2>
                <button
                    onClick={() => {
                        const next = !freeView;
                        setFreeView(next);
                        switchTo(!MOBILE && next ? 'persp' : 'ortho');
                    }}
                    className="px-3 py-1.5 rounded-md border text-sm hover:bg-gray-50"
                    title={freeView ? 'Lock top view' : 'Enable rotate/zoom'}
                >
                    {freeView ? 'Lock Top View' : 'Free Rotate'}
                </button>
            </div>

            {/* Font */}
            <label className="flex flex-col gap-1">
                <span className="text-sm">Font</span>
                <select className="border rounded px-3 py-2" value={fuente} onChange={(e) => setFuente(e.target.value)} disabled={!fontList.length}>
                    {fontList.map((f) => (<option key={f} value={f}>{f}</option>))}
                </select>
            </label>

            {/* Text */}
            <div className="grid sm:grid-cols-2 gap-4">
                <label className="flex flex-col gap-1">
                    <span className="text-sm">First line</span>
                    <input className="border rounded px-3 py-2" value={linea1} onChange={(e) => setLinea1(e.target.value)} maxLength={24}/>
                </label>
                <label className="flex flex-col gap-1">
                    <span className="text-sm">Second line (optional)</span>
                    <input className="border rounded px-3 py-2" value={linea2} onChange={(e) => setLinea2(e.target.value)} maxLength={24}/>
                </label>
            </div>

            {/* Sizes */}
            <div className="grid sm:grid-cols-3 gap-4">
                <label className="flex flex-col gap-1">
                    <span className="text-sm">Text size</span>
                    <input type="number" className="border rounded px-3 py-2" min={6} max={32} value={tamanio} onChange={(e) => setTamanio(Number(e.target.value) || 12)} />
                </label>
                <label className="flex flex-col gap-1">
                    <span className="text-sm">Text height (emboss + / engrave −)</span>
                    <input type="number" className="border rounded px-3 py-2" min={-3} max={5} step={0.1} value={altura} onChange={(e) => setAltura(Number(e.target.value) || 0)} />
                </label>
                <label className="flex flex-col gap-1">
                    <span className="text-sm">Base thickness</span>
                    <input type="number" className="border rounded px-3 py-2" min={1} max={8} step={0.1} value={alturaBorde} onChange={(e) => setAlturaBorde(Number(e.target.value) || 3)} />
                </label>
            </div>

            {/* Spacing / toggles */}
            <div className="grid sm:grid-cols-3 gap-4 items-end">
                <label className="flex flex-col gap-1">
                    <span className="text-sm">Line spacing (× text size)</span>
                    <input type="number" className="border rounded px-3 py-2" min={0.8} max={2.0} step={0.05} value={espaciado} onChange={(e) => setEspaciado(Number(e.target.value) || 1.2)} />
                </label>
                <label className="flex flex-col gap-1">
                    <span className="text-sm">Outline thickness</span>
                    <input type="number" className="border rounded px-3 py-2" min={1} max={8} step={0.1} value={grosorBorde} onChange={(e) => setGrosorBorde(Number(e.target.value) || 3)} />
                </label>
                <div className="flex gap-6 items-center">
                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={dosColores} onChange={(e) => setDosColores(e.target.checked)} />
                        <span className="text-sm">Two colors</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={mostrarAnilla} onChange={(e) => setMostrarAnilla(e.target.checked)} />
                        <span className="text-sm">Show ring</span>
                    </label>
                </div>
            </div>

            {/* Colors */}
            <div className="grid sm:grid-cols-3 gap-4">
                <label className="flex flex-col gap-1">
                    <span className="text-sm">{dosColores ? 'Base color' : 'Single color'}</span>
                    <select
                        className="border rounded px-3 py-2"
                        value={dosColores ? colors.baseName : colors.unicoName}
                        onChange={(e) => setColors((c) => (dosColores ? { ...c, baseName: e.target.value } : { ...c, unicoName: e.target.value }))}
                    >
                        {COLOR_OPTIONS.map((c) => (<option key={c}>{c}</option>))}
                    </select>
                </label>
                {dosColores && (
                    <label className="flex flex-col gap-1">
                        <span className="text-sm">Text color</span>
                        <select className="border rounded px-3 py-2" value={colors.textName} onChange={(e) => setColors((c) => ({ ...c, textName: e.target.value }))}>
                            {COLOR_OPTIONS.map((c) => (<option key={c}>{c}</option>))}
                        </select>
                    </label>
                )}
            </div>

            {/* Ring controls */}
            <div className="grid sm:grid-cols-2 gap-4">
                <label className="flex flex-col gap-1">
                    <span className="text-sm">Ring X offset (mm)</span>
                    <input type="range" min={-20} max={40} step={0.5} value={ajusteX} onChange={(e) => setAjusteX(parseFloat(e.target.value))} />
                    <input type="number" className="border rounded px-3 py-2 mt-1" value={ajusteX} step={0.5} onChange={(e) => setAjusteX(parseFloat(e.target.value) || 0)} />
                </label>
                <label className="flex flex-col gap-1">
                    <span className="text-sm">Ring Y offset (mm)</span>
                    <input type="range" min={-20} max={20} step={0.5} value={ajusteY} onChange={(e) => setAjusteY(parseFloat(e.target.value))} />
                    <input type="number" className="border rounded px-3 py-2 mt-1" value={ajusteY} step={0.5} onChange={(e) => setAjusteY(parseFloat(e.target.value) || 0)} />
                </label>
                <label className="flex flex-col gap-1">
                    <span className="text-sm">Ring outer diameter (mm)</span>
                    <input type="range" min={6} max={24} step={0.5} value={dExt} onChange={(e) => setDExt(parseFloat(e.target.value))} />
                    <input type="number" className="border rounded px-3 py-2 mt-1" value={dExt} step={0.5} onChange={(e) => setDExt(parseFloat(e.target.value) || 15)} />
                </label>
                <label className="flex flex-col gap-1">
                    <span className="text-sm">Ring inner diameter (mm)</span>
                    <input type="range" min={2} max={12} step={0.5} value={dInt} onChange={(e) => setDInt(parseFloat(e.target.value))} />
                    <input type="number" className="border rounded px-3 py-2 mt-1" value={dInt} step={0.5} onChange={(e) => setDInt(parseFloat(e.target.value) || 4)} />
                </label>
            </div>

            {/* Canvas */}
            <div
                ref={containerRef}
                className={`w-full rounded-xl border relative overflow-hidden
          ${freeView ? 'pointer-events-auto' : 'pointer-events-none sm:pointer-events-auto'}
          sm:min-h-[320px] md:min-h-[480px] lg:min-h-[520px]`}
                style={{ contentVisibility: 'auto' as any, containIntrinsicSize: '600px 320px' as any, contain: 'layout paint size', touchAction: 'pan-y' }}
            />
        </section>
    );
}
