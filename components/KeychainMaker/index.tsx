// app/components/keychain/KeychainBuilder.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useKeychainState } from './useKeychainState';
import { COLOR_OPTIONS, colorHex } from './colors';
import { useKeychainThree } from './useKeychainThree';
import { useKeychainCompile } from './useKeychainCompile';
import { compilePart } from './openscadClient';

const getCleanFontName = (fontString: string) => fontString.split(':')[0];

// Locale → cart URL
const CART_URLS: Record<string, string> = {
    en: 'https://shop.dreamli.nl/cart',
    nl: 'https://shop.dreamli.nl/nl/winkelwagen/',
    de: 'https://shop.dreamli.nl/de/warenkorb/',
    fr: 'https://shop.dreamli.nl/fr/panier/',
    pl: 'https://shop.dreamli.nl/pl/koszyk/'
};

// Helpers for redirect
const isLocalized = (u: string, loc: string) => {
    try {
        const url = new URL(u);
        return new RegExp(`/(?:${loc})(/|$)`).test(url.pathname);
    } catch {
        return false;
    }
};

const appendSearch = (base: string, from?: string) => {
    try {
        const baseURL = new URL(base);
        if (!from) return baseURL.toString();
        const fromURL = new URL(from);
        fromURL.searchParams.forEach((v, k) => baseURL.searchParams.set(k, v));
        return baseURL.toString();
    } catch {
        return base;
    }
};

type Props = {
    scadPath?: string;
    className?: string;
    woocommerceConfig?: {
        productId: number;
        apiUrl: string;
        /** optional per-instance override if you ever want to force a specific cart page */
        cartUrl?: string;
    };
};

export default function KeychainBuilder({
                                            scadPath = '/test.scad',
                                            className = '',
                                            woocommerceConfig = {
                                                productId: 123,
                                                apiUrl: '/wp-json/custom/v1/add-to-cart'
                                            }
                                        }: Props) {
    const t = useTranslations('KeychainBuilder');
    const locale = useLocale();

    const containerRef = useRef<HTMLDivElement | null>(null);
    const [activeTab, setActiveTab] = useState<'text' | 'style' | 'ring'>('text');
    const [showNotification, setShowNotification] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error';
    }>({ show: false, message: '', type: 'success' });
    const [isProcessing, setIsProcessing] = useState(false);

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
        setMostrarAnilla
    } = useKeychainState();

    const [fuente, setFuente] = fuenteState;
    const { linea1, setLinea1, linea2, setLinea2, tamanio, setTamanio } = textState;
    const { altura, setAltura, alturaBorde, setAlturaBorde, grosorBorde, setGrosorBorde, espaciado, setEspaciado } =
        geoState;
    const { ajusteX, setAjusteX, ajusteY, setAjusteY, dExt, setDExt, dInt, setDInt } = ringState;
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
            unico: colors.unicoName
        }
    });

    const { switchTo, setPartGeometry, setColors: viewerSetColors } = three;
    const { baseBuf, textBuf, holeBuf } = useKeychainCompile({ scadPath, defines });

    const generateFilename = () => {
        const timestamp = Date.now();
        const line1 = (defines.linea1 || 'keychain').replace(/[^a-zA-Z0-9]/g, '-');
        return `keychain-${line1}-${timestamp}.stl`;
    };

    const handleDownload = async () => {
        try {
            setIsProcessing(true);
            const buffer = await compilePart(scadPath, defines, 'all');
            if (!buffer || buffer.byteLength === 0) {
                console.warn('No STL data generated');
                return;
            }
            const filename = generateFilename();
            const blob = new Blob([buffer], { type: 'application/octet-stream' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Failed to download STL:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleAddToCart = async () => {
        try {
            setIsProcessing(true);

            const formData = new FormData();
            formData.append('product_id', String(woocommerceConfig.productId));
            formData.append('quantity', '1');

            const designData = {
                text: {
                    line1: defines.linea1,
                    line2: defines.linea2,
                    font: defines.fuente,
                    size: defines.tamanio_texto,
                    spacing: defines.espaciado_lineas
                },
                style: {
                    textHeight: defines.altura_texto,
                    baseThickness: defines.altura_borde,
                    borderThickness: defines.grosor_borde
                },
                ring: {
                    show: defines.mostrar_anilla,
                    outerDiameter: defines.diametro_exterior,
                    innerDiameter: defines.diametro_interior,
                    adjustX: defines.ajuste_x,
                    adjustY: defines.ajuste_y
                },
                colors: {
                    twoColor: defines.dos_colores,
                    base: defines.color_base,
                    text: defines.color_texto,
                    single: defines.color_unico
                }
            };

            formData.append('design_data', JSON.stringify(designData));

            const response = await fetch(woocommerceConfig.apiUrl, {
                method: 'POST',
                body: formData,
                credentials: 'include' // keep Woo session cookies if cross-origin
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const result = await response.json();

            if (result.success) {
                setShowNotification({
                    show: true,
                    message: t('notif.added'),
                    type: 'success'
                });

                // Choose redirect: prefer localized cart, but preserve API query string
                const apiUrlRaw: string | undefined =
                    result.cart_url || result.cartUrl || result.redirect || result.url;

                const propUrl = woocommerceConfig.cartUrl;
                const localeUrlRaw = CART_URLS[locale] || CART_URLS.en || '/cart';

                let target: string;
                if (apiUrlRaw && isLocalized(apiUrlRaw, locale)) {
                    // API already returned a localized URL for this locale
                    target = apiUrlRaw;
                } else {
                    const base = propUrl || localeUrlRaw;
                    target = appendSearch(base, apiUrlRaw); // graft ?keychain_design=... if provided
                }

                setTimeout(() => {
                    window.location.href = target || '/cart';
                }, 1200);
            } else {
                throw new Error('woocommerce_failed');
            }
        } catch (error: any) {
            console.error('Add to cart error:', error);
            setShowNotification({
                show: true,
                message: t('notif.failed', { msg: String(error?.message || 'error') }),
                type: 'error'
            });
            setTimeout(() => setShowNotification({ show: false, message: '', type: 'success' }), 2500);
        } finally {
            setIsProcessing(false);
        }
    };

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
            twoColors: dosColores
        });
    }, [colors.baseName, colors.textName, colors.unicoName, dosColores, viewerSetColors]);
    return (
        <div
            className={`min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 overflow-x-hidden ${className}`}
        >
            {/* Notification */}
            {showNotification.show && (
                <div className="fixed top-4 right-4 z-50">
                    <div
                        role="status"
                        aria-live="polite"
                        className={`px-6 py-3 rounded-lg shadow-lg ${
                            showNotification.type === 'success'
                                ? 'bg-green-500 text-white'
                                : 'bg-red-500 text-white'
                        }`}
                    >
                        {showNotification.message}
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 w-full">
                {/* Header */}
                <div className="mb-4 md:mb-6">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-1 md:mb-2">
                        {t('title')}
                    </h1>
                    <p className="text-sm md:text-base text-slate-600">
                        {t('subtitle')}
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-4 md:gap-6 w-full">
                    {/* Left Panel - Controls */}
                    <div className="lg:col-span-1 space-y-3 md:space-y-4 w-full min-w-0">
                        {/* Tabs */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-1 flex gap-1 w-full overflow-hidden">
                            {([
                                { id: 'text', label: t('tabs.text'), icon: '✏️' },
                                { id: 'style', label: t('tabs.style'), icon: '🎨' },
                                { id: 'ring',  label: t('tabs.ring'),  icon: '⭕' },
                            ] as const).map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
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
                                            {t('text.font')}
                                        </label>
                                        <select
                                            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            value={fuente}
                                            onChange={(e) => setFuente(e.target.value)}
                                            disabled={!fontList.length}
                                            aria-label={t('text.font')}
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
                                            {t('text.line1')}
                                        </label>
                                        <input
                                            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            value={linea1}
                                            onChange={(e) => setLinea1(e.target.value)}
                                            maxLength={24}
                                            placeholder={t('text.line1_ph')}
                                            aria-describedby="line1-count"
                                        />
                                        <div id="line1-count" className="text-xs text-slate-500 mt-1">
                                            {linea1.length}/24
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            {t('text.line2')} <span className="text-slate-400 font-normal">({t('optional')})</span>
                                        </label>
                                        <input
                                            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            value={linea2}
                                            onChange={(e) => setLinea2(e.target.value)}
                                            maxLength={24}
                                            placeholder={t('text.line2_ph')}
                                            aria-describedby="line2-count"
                                        />
                                        <div id="line2-count" className="text-xs text-slate-500 mt-1">
                                            {linea2.length}/24
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            {t('text.size')}
                                        </label>
                                        <div className="flex items-center gap-3 w-full min-w-0">
                                            <input
                                                type="range"
                                                className="flex-1 min-w-0"
                                                min={6}
                                                max={32}
                                                value={tamanio}
                                                onChange={(e) => setTamanio(Number(e.target.value))}
                                                aria-label={t('text.size')}
                                            />
                                            <input
                                                type="number"
                                                className="w-16 md:w-20 border border-slate-300 rounded-lg px-2 md:px-3 py-2 text-slate-900 text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent flex-shrink-0"
                                                min={6}
                                                max={32}
                                                value={tamanio}
                                                onChange={(e) => setTamanio(Number(e.target.value) || 12)}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            {t('text.spacing')}
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
                                                aria-label={t('text.spacing')}
                                            />
                                            <input
                                                type="number"
                                                className="w-20 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                min={0.8}
                                                max={2.0}
                                                step={0.05}
                                                value={espaciado}
                                                onChange={(e) => setEspaciado(Number(e.target.value) || 1.2)}
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
                                            {t('style.effect')}
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
                                                aria-label={t('style.effect')}
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
                                            {t('style.effect_hint')}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            {t('style.base')}
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
                                                aria-label={t('style.base')}
                                            />
                                            <input
                                                type="number"
                                                className="w-20 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                min={1}
                                                max={8}
                                                step={0.1}
                                                value={alturaBorde}
                                                onChange={(e) => setAlturaBorde(Number(e.target.value) || 3)}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            {t('style.outline')}
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="range"
                                                className="flex-1"
                                                min={1}
                                                max={8}
                                                step={0.1}
                                                value={grosorBorde}
                                                onChange={(e) => setGrosorBorde(Number(e.target.value))}
                                                aria-label={t('style.outline')}
                                            />
                                            <input
                                                type="number"
                                                className="w-20 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                min={1}
                                                max={8}
                                                step={0.1}
                                                value={grosorBorde}
                                                onChange={(e) => setGrosorBorde(Number(e.target.value) || 3)}
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-200 space-y-3">
                                        <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                      <span className="text-sm font-medium text-slate-700">
                        {t('style.twoColor')}
                      </span>
                                            <input
                                                type="checkbox"
                                                checked={dosColores}
                                                onChange={(e) => setDosColores(e.target.checked)}
                                                className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
                                                aria-label={t('style.twoColor')}
                                            />
                                        </label>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                {dosColores ? t('style.baseColor') : t('style.keychainColor')}
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
                                                            (dosColores ? colors.baseName : colors.unicoName) === colorName
                                                                ? 'border-blue-500 ring-2 ring-blue-200 scale-105'
                                                                : 'border-slate-300 hover:border-slate-400'
                                                        }`}
                                                        style={{ backgroundColor: colorHex(colorName) }}
                                                        title={colorName}
                                                        aria-label={colorName}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        {dosColores && (
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                    {t('style.textColor')}
                                                </label>
                                                <div className="grid grid-cols-5 gap-2">
                                                    {COLOR_OPTIONS.map((colorName) => (
                                                        <button
                                                            key={colorName}
                                                            type="button"
                                                            onClick={() => setColors((c) => ({ ...c, textName: colorName }))}
                                                            className={`w-full aspect-square rounded-lg border-2 transition-all hover:scale-110 ${
                                                                colors.textName === colorName
                                                                    ? 'border-blue-500 ring-2 ring-blue-200 scale-105'
                                                                    : 'border-slate-300 hover:border-slate-400'
                                                            }`}
                                                            style={{ backgroundColor: colorHex(colorName) }}
                                                            title={colorName}
                                                            aria-label={colorName}
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
                      {t('ring.show')}
                    </span>
                                        <input
                                            type="checkbox"
                                            checked={mostrarAnilla}
                                            onChange={(e) => setMostrarAnilla(e.target.checked)}
                                            className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
                                            aria-label={t('ring.show')}
                                        />
                                    </label>

                                    {mostrarAnilla && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                    {t('ring.x')}
                                                </label>
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="range"
                                                        className="flex-1"
                                                        min={-20}
                                                        max={40}
                                                        step={0.5}
                                                        value={ajusteX}
                                                        onChange={(e) => setAjusteX(parseFloat(e.target.value))}
                                                        aria-label={t('ring.x')}
                                                    />
                                                    <input
                                                        type="number"
                                                        className="w-20 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        value={ajusteX}
                                                        step={0.5}
                                                        onChange={(e) => setAjusteX(parseFloat(e.target.value) || 0)}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                    {t('ring.y')}
                                                </label>
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="range"
                                                        className="flex-1"
                                                        min={-20}
                                                        max={20}
                                                        step={0.5}
                                                        value={ajusteY}
                                                        onChange={(e) => setAjusteY(parseFloat(e.target.value))}
                                                        aria-label={t('ring.y')}
                                                    />
                                                    <input
                                                        type="number"
                                                        className="w-20 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        value={ajusteY}
                                                        step={0.5}
                                                        onChange={(e) => setAjusteY(parseFloat(e.target.value) || 0)}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                    {t('ring.outer')}
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
                                                        aria-label={t('ring.outer')}
                                                    />
                                                    <input
                                                        type="number"
                                                        className="w-20 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        value={dExt}
                                                        step={0.5}
                                                        onChange={(e) => setDExt(parseFloat(e.target.value) || 15)}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                    {t('ring.inner')}
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
                                                        aria-label={t('ring.inner')}
                                                    />
                                                    <input
                                                        type="number"
                                                        className="w-20 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        value={dInt}
                                                        step={0.5}
                                                        onChange={(e) => setDInt(parseFloat(e.target.value) || 4)}
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
                            <div className="border-b border-slate-200 p-3 md:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-slate-50 gap-2 sm:gap-0">
                                <div className="min-w-0">
                                    <h2 className="font-semibold text-slate-900 text-sm md:text-base">
                                        {t('viewer.title')}
                                    </h2>
                                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                                        {freeView ? t('viewer.hint_free') : t('viewer.hint_locked')}
                                    </p>
                                </div>

                                <div className="flex gap-2 flex-wrap">
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={isProcessing}
                                        className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-medium text-xs md:text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
                                            isProcessing
                                                ? 'bg-blue-300 text-white cursor-wait'
                                                : 'bg-blue-500 text-white hover:bg-blue-600 shadow-sm'
                                        }`}
                                        aria-busy={isProcessing}
                                    >
                                        <span>{isProcessing ? '⏳' : '🛒'}</span>
                                        {isProcessing ? t('actions.processing') : t('actions.addToCart')}
                                    </button>

                                    <button
                                        onClick={handleDownload}
                                        disabled={isProcessing}
                                        className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-medium text-xs md:text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
                                            isProcessing
                                                ? 'bg-green-300 text-white cursor-wait'
                                                : 'bg-green-500 text-white hover:bg-green-600 shadow-sm'
                                        }`}
                                    >
                                        <span>⬇️</span>
                                        {t('actions.download')}
                                    </button>

                                    <button
                                        onClick={() => {
                                            const next = !freeView;
                                            setFreeView(next);
                                            switchTo(!MOBILE && next ? 'persp' : 'ortho');
                                        }}
                                        className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-medium text-xs md:text-sm transition-all whitespace-nowrap flex-shrink-0 ${
                                            freeView
                                                ? 'bg-slate-500 text-white hover:bg-slate-600 shadow-sm'
                                                : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                                        }`}
                                        aria-pressed={freeView}
                                        aria-label={freeView ? t('actions.unlock') : t('actions.lock')}
                                        title={freeView ? t('actions.unlock') : t('actions.lock')}
                                    >
                                        {freeView ? '🔓' : '🔒'}
                                    </button>
                                </div>
                            </div>

                            {/* Canvas */}
                            <div
                                ref={containerRef}
                                className={`w-full bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden ${
                                    freeView ? 'pointer-events-auto' : 'pointer-events-none sm:pointer-events-auto'
                                } min-h-[300px] sm:min-h-[320px] md:min-h-[480px] lg:min-h-[520px]`}
                                style={{
                                    contentVisibility: 'auto' as any,
                                    containIntrinsicSize: '100% 300px' as any,
                                    contain: 'layout paint size',
                                    touchAction: 'pan-y',
                                    maxWidth: '100vw',
                                }}
                                aria-label={t('viewer.canvas')}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
