"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import useModels from "@/app/(lang)/[lang]/ai/hooks/useModels";
import LazyGlb from "@/components/GlbViewer";
import { analyzeModelUrl } from "@/lib/ai/model-metrics";
import { TYPE_OPTIONS, COLOR_OPTIONS_BY_TYPE } from "@/lib/ai/color-data";
import { useGetModelByIdQuery } from "@/app/(lang)/[lang]/ai/services/api";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function pickBestModelUrl(modelUrls?: Record<string, string | undefined>) {
  if (!modelUrls) return undefined;
  return modelUrls.glb || modelUrls.fbx || modelUrls.obj || modelUrls.usdz || undefined;
}

export default function PurchasePage() {
  const search = useSearchParams();
  const modelId = search.get("modelId") ?? undefined;
  const { models } = useModels();
  const model = useMemo(() => models?.find((m: any) => m.id === modelId), [models, modelId]);

  // Fetch from API if model is not present locally (e.g., coming from Marketplace)
  const { data: fetchedModel } = useGetModelByIdQuery({ modelId: modelId as string }, { skip: !modelId || !!model });
  const effectiveModel: any = model || fetchedModel;

  const modelUrl = pickBestModelUrl(effectiveModel?.modelUrls);

  // Dimensions in centimeters (each max 25)
  const [widthCm, setWidthCm] = useState<number>(10);
  const [heightCm, setHeightCm] = useState<number>(10);
  const [depthCm, setDepthCm] = useState<number>(10);
  const [typeSlug, setTypeSlug] = useState<string>('hs2lo'); // Basic
  const [colorSlug, setColorSlug] = useState<string | null>(null);
  const [qty, setQty] = useState<number>(1);
  const [fullSpectrum, setFullSpectrum] = useState<boolean>(false);

  // Model metrics + ratio tracking
  const [metrics, setMetrics] = useState<{
    sizeMm: { x: number; y: number; z: number };
    volumeMm3: number;
    weightG: number;
  } | null>(null);
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  const ratiosRef = useRef<{ rx: number; ry: number; rz: number; maxSizeMm: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!modelUrl) {
        setMetrics(null);
        ratiosRef.current = null;
        return;
      }
      try {
        setLoadingMetrics(true);
        const m = await analyzeModelUrl(modelUrl);
        if (cancelled) return;
        setMetrics({ sizeMm: m.sizeMm, volumeMm3: m.volumeMm3, weightG: m.weightG });
        const maxSizeMm = Math.max(m.sizeMm.x, m.sizeMm.y, m.sizeMm.z) || 1;
        const rx = m.sizeMm.x / maxSizeMm;
        const ry = m.sizeMm.y / maxSizeMm;
        const rz = m.sizeMm.z / maxSizeMm;
        ratiosRef.current = { rx, ry, rz, maxSizeMm };
        // Initialize UI size to keep ratio: set largest dimension to 10 cm by default
        const S = 10; // cm for the largest dimension
        setWidthCm(Number((rx * S).toFixed(2)));
        setHeightCm(Number((ry * S).toFixed(2)));
        setDepthCm(Number((rz * S).toFixed(2)));
      } catch (e) {
        console.error("Failed to analyze model:", e);
        // Fallback: reset ratios, keep current manual sizes
        ratiosRef.current = null;
      } finally {
        if (!cancelled) setLoadingMetrics(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [modelUrl]);

  // Keep ratio helper: scale all dims uniformly based on which one user edits
  function setDimsKeepingRatio(axis: 'w' | 'h' | 'd', value: number) {
    const val = clamp(Number(value) || 0, 0.1, 25);
    const r = ratiosRef.current;
    if (!r) {
      // No known ratio -> just set the single field
      if (axis === 'w') setWidthCm(val);
      if (axis === 'h') setHeightCm(val);
      if (axis === 'd') setDepthCm(val);
      return;
    }
    const { rx, ry, rz } = r;
    const rAxis = axis === 'w' ? rx : axis === 'h' ? ry : rz;
    let S = val / (rAxis || 1); // desired largest-dimension scale in cm
    // Bound by max 25 cm in any dimension
    const maxR = Math.max(rx, ry, rz) || 1;
    S = Math.min(S, 25 / maxR);
    // Also enforce min 0.1
    const minR = Math.max(0.0001, Math.max(rx, ry, rz));
    S = Math.max(S, 0.1 / minR);

    setWidthCm(Number((rx * S).toFixed(2)));
    setHeightCm(Number((ry * S).toFixed(2)));
    setDepthCm(Number((rz * S).toFixed(2)));
  }

  const sizeErrors = useMemo(() => {
    const errs: string[] = [];
    if (widthCm > 25 || heightCm > 25 || depthCm > 25) errs.push("Max size is 25 cm in any dimension.");
    if (widthCm <= 0 || heightCm <= 0 || depthCm <= 0) errs.push("All dimensions must be greater than 0.");
    return errs;
  }, [widthCm, heightCm, depthCm]);

  // Estimate weight at the selected cm size by scaling base volume (returns null when not computable)
  const estimatedWeightG = useMemo(() => {
    const vals = [widthCm, heightCm, depthCm];
    if (!vals.every((v) => Number.isFinite(v) && v > 0)) return null;
    const volumeCm3 = widthCm * heightCm * depthCm;
    const gramsPerCm3 = 0.1; // calibrated so 25×20×45 cm ≈ 225 g
    const grams = volumeCm3 * gramsPerCm3;
    return Number.isFinite(grams) ? grams : null;
  }, [widthCm, heightCm, depthCm]);

  // Pricing: base from weight, then type percent, optional full spectrum fixed surcharge, times quantity
  const pricing = useMemo(() => {
    const qtySafe = Number.isFinite(qty) && qty > 0 ? Math.floor(qty) : 1;
    const grams = estimatedWeightG != null && Number.isFinite(estimatedWeightG as number) ? (estimatedWeightG as number) : null;

    // Base from weight (target: 25×20×45 cm ≈ 225 g → ~€18–€19)
    const handling = 10; // €
    const pricePerGram = 0.12; // €/g
    let base = 10; // minimum
    if (grams != null) base = Math.max(10, handling + grams * pricePerGram);

    // Type percent surcharge (from JSON)
    const type = TYPE_OPTIONS.find((t) => t.slug === typeSlug);
    const extraPercent = type && type.pricing_type === 'percent' ? type.pricing_amount : 0;
    const typeSurcharge = base * (extraPercent / 100);
    const perUnitBeforeFS = base + typeSurcharge;

    // Full Spectrum (by human) fixed surcharge tiers based on weight
    const fsAmount = grams != null ? (grams <= 150 ? 60 : grams <= 300 ? 90 : 120) : 60;
    const fsSurcharge = fullSpectrum ? fsAmount : 0;

    const perUnit = perUnitBeforeFS + fsSurcharge;
    const total = perUnit * qtySafe;

    return {
      base,
      grams,
      typePercent: extraPercent,
      typeLabel: type?.label ?? 'Basic',
      typeSurcharge,
      perUnitBeforeFS,
      fsEnabled: fullSpectrum,
      fsSurcharge,
      perUnit,
      total,
      qty: qtySafe,
    };
  }, [estimatedWeightG, typeSlug, qty, fullSpectrum]);

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const localeCartUrls: Record<string, string> = {
    en: 'https://shop.dreamli.nl/cart',
    nl: 'https://shop.dreamli.nl/nl/winkelwagen/',
    de: 'https://shop.dreamli.nl/de/warenkorb/',
    fr: 'https://shop.dreamli.nl/fr/panier/',
    pl: 'https://shop.dreamli.nl/pl/koszyk/'
  };

    const onProceed = async () => {
        if (sizeErrors.length || submitting) return;
        setSubmitError(null);
        setSubmitting(true);

        try {
            // ✅ New API endpoint for figurines
            const apiUrl = 'https://shop.dreamli.nl/wp-json/custom/v1/add-figurine';
            const productId = Number(process.env.NEXT_PUBLIC_WOO_AI_PRODUCT_ID || 50394);

            // ✅ Find the best preview image
            const previewImage =
                effectiveModel?.thumbnailUrl ||
                effectiveModel?.imageUrls?.[0] ||
                '';

            // ✅ Build FormData for new API
            const fd = new FormData();
            fd.append('product_id', String(productId));
            fd.append('quantity', String(pricing.qty));
            fd.append('price', pricing.perUnit.toFixed(2));
            fd.append('image_url', previewImage);

            // All relevant figurine data stored as JSON
            fd.append(
                'figurine_data',
                JSON.stringify({
                    modelId: (effectiveModel?.id || modelId),
                    modelUrl:
                        effectiveModel?.modelUrls?.glb ||
                        effectiveModel?.modelUrls?.fbx ||
                        effectiveModel?.modelUrls?.obj ||
                        modelUrl ||
                        '',
                    prompt: effectiveModel?.prompt || effectiveModel?.kind || '',
                    size: { widthCm, heightCm, depthCm },
                    weightG: pricing.grams,
                    typeSlug,
                    colorSlug,
                    fullSpectrum,
                    pricing: {
                        base: pricing.base,
                        typePercent: pricing.typePercent,
                        typeSurcharge: pricing.typeSurcharge,
                        fsSurcharge: pricing.fsSurcharge,
                        perUnit: pricing.perUnit,
                        total: pricing.total,
                    },
                })
            );

            // ✅ Send to WooCommerce
            const res = await fetch(apiUrl, {
                method: 'POST',
                body: fd,
                credentials: 'include',
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json().catch(() => ({}));

            // ✅ Redirect logic (same as before)
            const locale =
                (typeof navigator !== 'undefined' && (navigator.language || '').slice(0, 2)) ||
                'en';
            const cartUrlPref = localeCartUrls[locale] || localeCartUrls.en;
            const apiCartUrl: string | undefined =
                data.cart_url || data.cartUrl || data.redirect || data.url;

            let target = cartUrlPref;
            try {
                if (apiCartUrl) {
                    const base = new URL(cartUrlPref);
                    const apiU = new URL(apiCartUrl);
                    apiU.searchParams.forEach((v, k) => base.searchParams.set(k, v));
                    target = base.toString();
                }
            } catch {}

            window.location.href = target;
        } catch (e: any) {
            console.error('Add to cart failed:', e);
            setSubmitError('Failed to add to cart. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Purchase 3D Model</h1>

      {effectiveModel ? (
        <div className="rounded-xl border p-3">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium truncate">{effectiveModel?.prompt ?? effectiveModel?.kind}</div>
            <div className="text-[10px] text-gray-500">
              {new Date((effectiveModel?.createdAt ?? Date.now())).toLocaleString()}
            </div>
          </div>
          {/* Preview if possible */}
          {modelUrl ? (
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <LazyGlb key={modelUrl || effectiveModel?.id} modelUrl={modelUrl} />
            </div>
          ) : effectiveModel?.thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={effectiveModel?.thumbnailUrl} alt="thumb" className="w-full rounded-lg" />
          ) : null}
        </div>
      ) : (
        <div className="rounded-xl border p-3 text-sm text-gray-600">
          No specific model selected. You can still configure size and finish.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Size selector */}
        <div className="rounded-xl border p-4 space-y-3">
          <div className="font-medium">Choose Size (cm)</div>
          <div className="text-xs text-gray-500">
            Max 25 cm in each dimension. {loadingMetrics ? "Analyzing model…" : metrics ? `Model ratio locked` : null}
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              className="px-2 py-1 text-xs border rounded"
              onClick={() => {
                const S = 5;
                const r = ratiosRef.current;
                if (r) {
                  setWidthCm(Number((r.rx * S).toFixed(2)));
                  setHeightCm(Number((r.ry * S).toFixed(2)));
                  setDepthCm(Number((r.rz * S).toFixed(2)));
                } else {
                  setWidthCm(S); setHeightCm(S); setDepthCm(S);
                }
              }}
            >
              Small (max ~5cm)
            </button>
            <button
              type="button"
              className="px-2 py-1 text-xs border rounded"
              onClick={() => {
                const S = 10;
                const r = ratiosRef.current;
                if (r) {
                  setWidthCm(Number((r.rx * S).toFixed(2)));
                  setHeightCm(Number((r.ry * S).toFixed(2)));
                  setDepthCm(Number((r.rz * S).toFixed(2)));
                } else {
                  setWidthCm(S); setHeightCm(S); setDepthCm(S);
                }
              }}
            >
              Medium (max ~10cm)
            </button>
            <button
              type="button"
              className="px-2 py-1 text-xs border rounded"
              onClick={() => {
                const S = 15;
                const r = ratiosRef.current;
                if (r) {
                  setWidthCm(Number((r.rx * S).toFixed(2)));
                  setHeightCm(Number((r.ry * S).toFixed(2)));
                  setDepthCm(Number((r.rz * S).toFixed(2)));
                } else {
                  setWidthCm(S); setHeightCm(S); setDepthCm(S);
                }
              }}
            >
              Large (max ~15cm)
            </button>
            <button
              type="button"
              className="px-2 py-1 text-xs border rounded"
              onClick={() => {
                const S = 25;
                const r = ratiosRef.current;
                if (r) {
                  setWidthCm(Number((r.rx * S).toFixed(2)));
                  setHeightCm(Number((r.ry * S).toFixed(2)));
                  setDepthCm(Number((r.rz * S).toFixed(2)));
                } else {
                  setWidthCm(S); setHeightCm(S); setDepthCm(S);
                }
              }}
            >
              Max (25cm)
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <label className="text-xs space-y-1">
              <div>Width</div>
              <input
                type="number"
                value={widthCm}
                onChange={(e) => setDimsKeepingRatio('w', Number(e.target.value))}
                min={0.1}
                max={25}
                step={0.5}
                className="w-full border rounded px-2 py-1"
              />
            </label>
            <label className="text-xs space-y-1">
              <div>Height</div>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setDimsKeepingRatio('h', Number(e.target.value))}
                min={0.1}
                max={25}
                step={0.5}
                className="w-full border rounded px-2 py-1"
              />
            </label>
            <label className="text-xs space-y-1">
              <div>Depth</div>
              <input
                type="number"
                value={depthCm}
                onChange={(e) => setDimsKeepingRatio('d', Number(e.target.value))}
                min={0.1}
                max={25}
                step={0.5}
                className="w-full border rounded px-2 py-1"
              />
            </label>
          </div>
          <div className="text-xs text-gray-600">
            {metrics ? (
              <div>Model bounding box (mm): {metrics.sizeMm.x.toFixed(1)} × {metrics.sizeMm.y.toFixed(1)} × {metrics.sizeMm.z.toFixed(1)}</div>
            ) : null}
            <div>
              Estimated weight (from size): {estimatedWeightG != null && Number.isFinite(estimatedWeightG as number) ? `${(estimatedWeightG as number).toFixed(1)} g` : 'N/A'}
            </div>
          </div>
          {sizeErrors.length > 0 && (
            <div className="text-xs text-red-600">
              {sizeErrors.map((e, i) => (
                <div key={i}>{e}</div>
              ))}
            </div>
          )}
        </div>

        {/* Type & Color selector */}
        <div className="rounded-xl border p-4 space-y-3">
          <div className="font-medium">Type & Color</div>
          <div className="text-xs text-gray-500">
            <a href="/color-guide/">Are you confused? click here!</a>
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            {TYPE_OPTIONS.map((opt) => (
              <label key={opt.slug} className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="type"
                  checked={typeSlug === opt.slug}
                  onChange={() => {
                    setTypeSlug(opt.slug);
                    setColorSlug(null);
                  }}
                />
                <span>
                  {opt.label}
                  {opt.pricing_type === 'percent' && opt.pricing_amount ? ` (+${opt.pricing_amount}%)` : ''}
                </span>
              </label>
            ))}
          </div>
          <div className="mt-3">
            <div className="text-xs text-gray-500 mb-2">Select color</div>
            <div className="grid grid-cols-3 gap-3">
              {(COLOR_OPTIONS_BY_TYPE[typeSlug] ?? []).map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => setColorSlug(c.slug)}
                  className={`border rounded-lg overflow-hidden focus:outline-none ${colorSlug === c.slug ? 'ring-2 ring-black' : ''}`}
                  title={c.label}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.image} alt={c.label} className="w-full h-16 object-cover" />
                  <div className="text-[10px] p-1 text-center truncate">{c.label}</div>
                </button>
              ))}
              {(COLOR_OPTIONS_BY_TYPE[typeSlug] ?? []).length === 0 && (
                <div className="text-xs text-gray-500">No colors available for this type.</div>
              )}
            </div>
          </div>
          <div className="mt-4 border-t pt-3">
            <div className="font-medium text-sm">Finish Options</div>
            <label className="mt-2 flex items-center justify-between text-sm">
              <div>
                <div>Full Spectrum color (by human)</div>
                <div className="text-xs text-gray-500">Hand-painted multi-color finish. Price depends on weight.</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm">+€{(estimatedWeightG != null ? ((estimatedWeightG as number) <= 150 ? 60 : (estimatedWeightG as number) <= 300 ? 90 : 120) : 60).toFixed(2)}</span>
                <input type="checkbox" checked={fullSpectrum} onChange={(e) => setFullSpectrum(e.target.checked)} />
              </div>
            </label>
          </div>
        </div>

        {/* Price summary */}
        <div className="rounded-xl border p-4 space-y-3 lg:sticky lg:top-4">
          <div className="font-medium">Price</div>
          <div className="text-sm flex items-center justify-between">
            <span>Base (per unit)</span>
            <span>€{pricing.base.toFixed(2)}</span>
          </div>
          <div className="text-xs text-gray-500 text-right">
            Estimated weight: {pricing.grams != null ? `${pricing.grams.toFixed(1)} g` : 'N/A'}
          </div>
          <div className="text-sm flex items-center justify-between">
            <span>Type: {pricing.typeLabel}{pricing.typePercent ? ` (+${pricing.typePercent}%)` : ''}</span>
            <span>€{pricing.typeSurcharge.toFixed(2)}</span>
          </div>
          {pricing.fsEnabled ? (
            <div className="text-sm flex items-center justify-between">
              <span>Full Spectrum (by human)</span>
              <span>€{pricing.fsSurcharge.toFixed(2)}</span>
            </div>
          ) : null}
          <div className="text-sm flex items-center justify-between">
            <span>Quantity</span>
            <input
              type="number"
              min={1}
              step={1}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Math.floor(Number(e.target.value) || 1)))}
              className="w-20 border rounded px-2 py-1 text-right"
            />
          </div>
          <div className="h-px bg-gray-200 my-2" />
          <div className="text-base font-semibold flex items-center justify-between">
            <span>Total</span>
            <span>€{pricing.total.toFixed(2)}</span>
          </div>
          {submitError && (
            <div className="text-xs text-red-600 mb-2">{submitError}</div>
          )}
          <button
            onClick={onProceed}
            disabled={sizeErrors.length > 0 || submitting}
            className="mt-2 w-full px-3 py-2 rounded-xl shadow text-sm border bg-black text-white disabled:opacity-50"
          >
            {submitting ? 'Adding to cart…' : 'Proceed to Checkout'}
          </button>
        </div>
      </div>
    </div>
  );
}
