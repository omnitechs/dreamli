// app/components/keychain/KeychainBuilder.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useKeychainState } from './useKeychainState';
import { COLOR_OPTIONS, colorHex } from './colors';
import { useKeychainThree } from './useKeychainThree';
import { useKeychainCompile } from './useKeychainCompile';

// Extract clean font names from the full font strings
const getCleanFontName = (fontString: string) => {
    // Remove style suffixes like ":style=Book", ":style=Regular"
    return fontString.split(':')[0];
};

type Props = {
    scadPath?: string;
    className?: string;
};

export default function KeychainBuilder({
                                            scadPath = '/test.scad',
                                            className = '',
                                        }: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [activeTab, setActiveTab] = useState<'text' | 'style' | 'ring'>('text');

    const {
        MOBILE,
        fontList,
        fuenteState,
        textState,
        geoState,
        ringState,
        colorState,
        viewerState,
        defines,
        mostrarAnilla,
        setMostrarAnilla,
    } = useKeychainState();

    const [fuente, setFuente] = fuenteState;
    const { linea1, setLinea1, linea2, setLinea2, tamanio, setTamanio } = textState;
    const {
        altura,
        setAltura,
        alturaBorde,
        setAlturaBorde,
        grosorBorde,
        setGrosorBorde,
        espaciado,
        setEspaciado,
    } = geoState;
    const {
        ajusteX,
        setAjusteX,
        ajusteY,
        setAjusteY,
        dExt,
        setDExt,
        dInt,
        setDInt,
    } = ringState;
    const { dosColores, setDosColores, colors, setColors } = colorState;
    const { freeView, setFreeView } = viewerState;

    const three = useKeychainThree({
        containerRef,
        defines,
        scadPath,
        freeView,
        MOBILE,
        colorNames: {
            base: colors.baseName,
            text: colors.textName,
            unico: colors.unicoName,
        },
    });

    const { switchTo, setPartGeometry, setColors: viewerSetColors } = three;

    const { baseBuf, textBuf, holeBuf } = useKeychainCompile({ scadPath, defines });

    useEffect(() => {
        if (baseBuf && baseBuf.byteLength) setPartGeometry('base', baseBuf);
    }, [baseBuf, setPartGeometry]);

    useEffect(() => {
        if (textBuf && textBuf.byteLength) setPartGeometry('text', textBuf);
    }, [textBuf, setPartGeometry]);

    useEffect(() => {
        if (holeBuf && holeBuf.byteLength) setPartGeometry('hole', holeBuf);
    }, [holeBuf, setPartGeometry]);

    useEffect(() => {
        viewerSetColors({
            base: colors.baseName,
            text: colors.textName,
            unico: colors.unicoName,
            twoColors: dosColores,
        });
    }, [
        colors.baseName,
        colors.textName,
        colors.unicoName,
        dosColores,
        viewerSetColors,
    ]);

    return (
        <div
            className={`min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 overflow-x-hidden ${className}`}
        >
            <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 w-full">
                {/* Header */}
                <div className="mb-4 md:mb-6">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-1 md:mb-2">
                        Keychain Builder
                    </h1>
                    <p className="text-sm md:text-base text-slate-600">
                        Design your custom 3D printed keychain
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-4 md:gap-6 w-full">
                    {/* Left Panel - Controls */}
                    <div className="lg:col-span-1 space-y-3 md:space-y-4 w-full min-w-0">
                        {/* Tab Navigation */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-1 flex gap-1 w-full overflow-hidden">
                            {[
                                { id: 'text', label: 'Text', icon: '✏️' },
                                { id: 'style', label: 'Style', icon: '🎨' },
                                { id: 'ring', label: 'Ring', icon: '⭕' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                                    className={`flex-1 py-2 md:py-2.5 px-2 md:px-3 rounded-lg font-medium text-xs md:text-sm transition-all whitespace-nowrap ${
                                        activeTab === tab.id
                                            ? 'bg-blue-500 text-white shadow-sm'
                                            : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                                >
                                    <span className="hidden sm:inline mr-1.5">{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Settings Panel */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6 space-y-4 md:space-y-6 w-full min-w-0">
                            {/* Text Tab */}
                            {activeTab === 'text' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Font Family
                                        </label>
                                        <select
                                            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            value={fuente}
                                            onChange={(e) => setFuente(e.target.value)}
                                            disabled={!fontList.length}
                                        >
                                            {fontList.map((f) => (
                                                <option key={f} value={f}>
                                                    {getCleanFontName(f)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            First Line
                                        </label>
                                        <input
                                            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            value={linea1}
                                            onChange={(e) => setLinea1(e.target.value)}
                                            maxLength={24}
                                            placeholder="Enter first line"
                                        />
                                        <div className="text-xs text-slate-500 mt-1">
                                            {linea1.length}/24
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Second Line{' '}
                                            <span className="text-slate-400 font-normal">
                        (optional)
                      </span>
                                        </label>
                                        <input
                                            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            value={linea2}
                                            onChange={(e) => setLinea2(e.target.value)}
                                            maxLength={24}
                                            placeholder="Enter second line"
                                        />
                                        <div className="text-xs text-slate-500 mt-1">
                                            {linea2.length}/24
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Text Size
                                        </label>
                                        <div className="flex items-center gap-3 w-full min-w-0">
                                            <input
                                                type="range"
                                                className="flex-1 min-w-0"
                                                min={6}
                                                max={32}
                                                value={tamanio}
                                                onChange={(e) => setTamanio(Number(e.target.value))}
                                            />
                                            <input
                                                type="number"
                                                className="w-16 md:w-20 border border-slate-300 rounded-lg px-2 md:px-3 py-2 text-slate-900 text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent flex-shrink-0"
                                                min={6}
                                                max={32}
                                                value={tamanio}
                                                onChange={(e) =>
                                                    setTamanio(Number(e.target.value) || 12)
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Line Spacing
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="range"
                                                className="flex-1"
                                                min={0.8}
                                                max={2.0}
                                                step={0.05}
                                                value={espaciado}
                                                onChange={(e) => setEspaciado(Number(e.target.value))}
                                            />
                                            <input
                                                type="number"
                                                className="w-20 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                min={0.8}
                                                max={2.0}
                                                step={0.05}
                                                value={espaciado}
                                                onChange={(e) =>
                                                    setEspaciado(Number(e.target.value) || 1.2)
                                                }
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Style Tab */}
                            {activeTab === 'style' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Text Effect
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="range"
                                                className="flex-1"
                                                min={-3}
                                                max={5}
                                                step={0.1}
                                                value={altura}
                                                onChange={(e) => setAltura(Number(e.target.value))}
                                            />
                                            <input
                                                type="number"
                                                className="w-20 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                min={-3}
                                                max={5}
                                                step={0.1}
                                                value={altura}
                                                onChange={(e) => setAltura(Number(e.target.value) || 0)}
                                            />
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1">
                                            Positive = Embossed, Negative = Engraved
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Base Thickness
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="range"
                                                className="flex-1"
                                                min={1}
                                                max={8}
                                                step={0.1}
                                                value={alturaBorde}
                                                onChange={(e) => setAlturaBorde(Number(e.target.value))}
                                            />
                                            <input
                                                type="number"
                                                className="w-20 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                min={1}
                                                max={8}
                                                step={0.1}
                                                value={alturaBorde}
                                                onChange={(e) =>
                                                    setAlturaBorde(Number(e.target.value) || 3)
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Outline Thickness
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="range"
                                                className="flex-1"
                                                min={1}
                                                max={8}
                                                step={0.1}
                                                value={grosorBorde}
                                                onChange={(e) =>
                                                    setGrosorBorde(Number(e.target.value))
                                                }
                                            />
                                            <input
                                                type="number"
                                                className="w-20 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                min={1}
                                                max={8}
                                                step={0.1}
                                                value={grosorBorde}
                                                onChange={(e) =>
                                                    setGrosorBorde(Number(e.target.value) || 3)
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-200 space-y-3">
                                        <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                      <span className="text-sm font-medium text-slate-700">
                        Two Color Mode
                      </span>
                                            <input
                                                type="checkbox"
                                                checked={dosColores}
                                                onChange={(e) => setDosColores(e.target.checked)}
                                                className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
                                            />
                                        </label>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                {dosColores ? 'Base Color' : 'Keychain Color'}
                                            </label>
                                            <div className="grid grid-cols-5 gap-2">
                                                {COLOR_OPTIONS.map((colorName) => (
                                                    <button
                                                        key={colorName}
                                                        type="button"
                                                        onClick={() =>
                                                            setColors((c) =>
                                                                dosColores
                                                                    ? { ...c, baseName: colorName }
                                                                    : { ...c, unicoName: colorName }
                                                            )
                                                        }
                                                        className={`w-full aspect-square rounded-lg border-2 transition-all hover:scale-110 ${
                                                            (dosColores ? colors.baseName : colors.unicoName) ===
                                                            colorName
                                                                ? 'border-blue-500 ring-2 ring-blue-200 scale-105'
                                                                : 'border-slate-300 hover:border-slate-400'
                                                        }`}
                                                        style={{ backgroundColor: colorHex(colorName) }}
                                                        title={colorName}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        {dosColores && (
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                    Text Color
                                                </label>
                                                <div className="grid grid-cols-5 gap-2">
                                                    {COLOR_OPTIONS.map((colorName) => (
                                                        <button
                                                            key={colorName}
                                                            type="button"
                                                            onClick={() =>
                                                                setColors((c) => ({ ...c, textName: colorName }))
                                                            }
                                                            className={`w-full aspect-square rounded-lg border-2 transition-all hover:scale-110 ${
                                                                colors.textName === colorName
                                                                    ? 'border-blue-500 ring-2 ring-blue-200 scale-105'
                                                                    : 'border-slate-300 hover:border-slate-400'
                                                            }`}
                                                            style={{ backgroundColor: colorHex(colorName) }}
                                                            title={colorName}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* Ring Tab */}
                            {activeTab === 'ring' && (
                                <>
                                    <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                    <span className="text-sm font-medium text-slate-700">
                      Show Ring
                    </span>
                                        <input
                                            type="checkbox"
                                            checked={mostrarAnilla}
                                            onChange={(e) => setMostrarAnilla(e.target.checked)}
                                            className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
                                        />
                                    </label>

                                    {mostrarAnilla && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                    X Position
                                                </label>
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="range"
                                                        className="flex-1"
                                                        min={-20}
                                                        max={40}
                                                        step={0.5}
                                                        value={ajusteX}
                                                        onChange={(e) =>
                                                            setAjusteX(parseFloat(e.target.value))
                                                        }
                                                    />
                                                    <input
                                                        type="number"
                                                        className="w-20 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        value={ajusteX}
                                                        step={0.5}
                                                        onChange={(e) =>
                                                            setAjusteX(parseFloat(e.target.value) || 0)
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                    Y Position
                                                </label>
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="range"
                                                        className="flex-1"
                                                        min={-20}
                                                        max={20}
                                                        step={0.5}
                                                        value={ajusteY}
                                                        onChange={(e) =>
                                                            setAjusteY(parseFloat(e.target.value))
                                                        }
                                                    />
                                                    <input
                                                        type="number"
                                                        className="w-20 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        value={ajusteY}
                                                        step={0.5}
                                                        onChange={(e) =>
                                                            setAjusteY(parseFloat(e.target.value) || 0)
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                    Outer Diameter
                                                </label>
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="range"
                                                        className="flex-1"
                                                        min={6}
                                                        max={24}
                                                        step={0.5}
                                                        value={dExt}
                                                        onChange={(e) => setDExt(parseFloat(e.target.value))}
                                                    />
                                                    <input
                                                        type="number"
                                                        className="w-20 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        value={dExt}
                                                        step={0.5}
                                                        onChange={(e) =>
                                                            setDExt(parseFloat(e.target.value) || 15)
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                    Inner Diameter
                                                </label>
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="range"
                                                        className="flex-1"
                                                        min={2}
                                                        max={12}
                                                        step={0.5}
                                                        value={dInt}
                                                        onChange={(e) => setDInt(parseFloat(e.target.value))}
                                                    />
                                                    <input
                                                        type="number"
                                                        className="w-20 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        value={dInt}
                                                        step={0.5}
                                                        onChange={(e) =>
                                                            setDInt(parseFloat(e.target.value) || 4)
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Right Panel - Preview */}
                    <div className="lg:col-span-2 w-full min-w-0">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden w-full">
                            {/* Viewer Header */}
                            <div className="border-b border-slate-200 p-3 md:p-4 md:flex flex-col sm:flex-row sm:items-center sm:justify-between bg-slate-50 gap-2 sm:gap-0 hidden">
                                <div className="min-w-0">
                                    <h2 className="font-semibold text-slate-900 text-sm md:text-base">
                                        3D Preview
                                    </h2>
                                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                                        {freeView
                                            ? 'Drag to rotate, scroll to zoom'
                                            : 'Top view locked'}
                                    </p>
                                </div>

                                <button
                                    onClick={() => {
                                        const next = !freeView;
                                        setFreeView(next);
                                        switchTo(!MOBILE && next ? 'persp' : 'ortho');
                                    }}
                                    className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-medium text-xs md:text-sm transition-all whitespace-nowrap flex-shrink-0 ${
                                        freeView
                                            ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-sm'
                                            : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                                    }`}
                                >
                                    {freeView ? '🔓 Free View' : '🔒 Lock View'}
                                </button>
                            </div>

                            {/* Canvas */}
                            <div
                                ref={containerRef}
                                className={`w-full bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden ${
                                    freeView
                                        ? 'pointer-events-auto'
                                        : 'pointer-events-none sm:pointer-events-auto'
                                } min-h-[300px] sm:min-h-[320px] md:min-h-[480px] lg:min-h-[520px]`}
                                style={{
                                    contentVisibility: 'auto' as any,
                                    containIntrinsicSize: '100% 300px' as any,
                                    contain: 'layout paint size',
                                    touchAction: 'pan-y',
                                    maxWidth: '100vw',
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
