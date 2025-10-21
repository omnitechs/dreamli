"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import useModels from "@/app/(lang)/[lang]/ai/hooks/useModels";
import LazyGlb from "@/components/GlbViewer";
import { analyzeModelUrl } from "@/lib/ai/model-metrics";
import { TYPE_OPTIONS, COLOR_OPTIONS_BY_TYPE } from "@/lib/ai/color-data";

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
  const modelUrl = pickBestModelUrl(model?.modelUrls);

  // Dimensions in centimeters (each max 25)
  const [widthCm, setWidthCm] = useState<number>(10);
  const [heightCm, setHeightCm] = useState<number>(10);
  const [depthCm, setDepthCm] = useState<number>(10);
  const [typeSlug, setTypeSlug] = useState<string>('hs2lo'); // Basic
  const [colorSlug, setColorSlug] = useState<string | null>(null);
  const [qty, setQty] = useState<number>(1);

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
    try {
      if (!metrics || !ratiosRef.current) return null;
      const { volumeMm3 } = metrics;
      if (!Number.isFinite(volumeMm3)) return null;
      const { maxSizeMm, rx, ry, rz } = ratiosRef.current;
      if (![maxSizeMm, rx, ry, rz, widthCm, heightCm, depthCm].every((v) => Number.isFinite(v))) return null;
      const currentLargestCm = Math.max(widthCm / (rx || 1), heightCm / (ry || 1), depthCm / (rz || 1));
      if (!Number.isFinite(currentLargestCm)) return null;
      const k = (currentLargestCm * 10) / (maxSizeMm || 1);
      if (!Number.isFinite(k)) return null;
      const volScaled = volumeMm3 * k * k * k;
      if (!Number.isFinite(volScaled)) return null;
      const densityPLA = 1.24e-3; // g/mm^3
      const infill = 0.2;
      const grams = volScaled * infill * densityPLA;
      return Number.isFinite(grams) ? grams : null;
    } catch {
      return null;
    }
  }, [metrics, widthCm, heightCm, depthCm]);

  // Pricing: prefer material-based (by estimated grams) with fallback to size-based heuristic
  const pricing = useMemo(() => {
    const qtySafe = Number.isFinite(qty) && qty > 0 ? Math.floor(qty) : 1;
    const type = TYPE_OPTIONS.find((t) => t.slug === typeSlug);
    const extraPercent = type && type.pricing_type === 'percent' ? type.pricing_amount : 0;

    let base: number;
    if (estimatedWeightG != null && Number.isFinite(estimatedWeightG as number)) {
      const grams = estimatedWeightG as number;
      const handling = 6; // €
      const pricePerGram = 0.06; // €/g
      base = Math.max(10, handling + grams * pricePerGram);
    } else {
      // Fallback: previous size-based heuristic
      const w = clamp(widthCm, 0, 25);
      const h = clamp(heightCm, 0, 25);
      const d = clamp(depthCm, 0, 25);
      const maxVol = 25 * 25 * 25;
      const vol = w * h * d;
      const fraction = maxVol === 0 ? 0 : clamp(vol / maxVol, 0, 1);
      base = 10 + 20 * fraction; // €10 .. €30
    }

    const typeSurcharge = base * (extraPercent / 100);
    const perUnit = base + typeSurcharge;
    const total = perUnit * qtySafe;
    return { base, typePercent: extraPercent, typeLabel: type?.label ?? 'Basic', typeSurcharge, perUnit, total, qty: qtySafe };
  }, [widthCm, heightCm, depthCm, estimatedWeightG, typeSlug, qty]);

  const onProceed = () => {
    if (sizeErrors.length) return;
    // Placeholder: integrate with checkout/cart later
    const typeLine = `Type: ${pricing.typeLabel}${pricing.typePercent ? ` (+${pricing.typePercent}%)` : ''}`;
    const colorLine = `Color: ${colorSlug ?? '—'}`;
    alert(`Order summary:\nModel: ${model?.prompt ?? model?.kind ?? modelId ?? "(unknown)"}\nSize: ${widthCm}×${heightCm}×${depthCm} cm\n${typeLine}\n${colorLine}\nQuantity: ${pricing.qty}\nTotal: €${pricing.total.toFixed(2)}`);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Purchase 3D Model</h1>

      {model ? (
        <div className="rounded-xl border p-3">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium truncate">{model.prompt ?? model.kind}</div>
            <div className="text-[10px] text-gray-500">
              {new Date(model.createdAt ?? Date.now()).toLocaleString()}
            </div>
          </div>
          {/* Preview if possible */}
          {modelUrl ? (
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <LazyGlb key={modelUrl || model.id} modelUrl={modelUrl} />
            </div>
          ) : model.thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={model.thumbnailUrl} alt="thumb" className="w-full rounded-lg" />
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
          {metrics && (
            <div className="text-xs text-gray-600">
              <div>Model bounding box (mm): {metrics.sizeMm.x.toFixed(1)} × {metrics.sizeMm.y.toFixed(1)} × {metrics.sizeMm.z.toFixed(1)}</div>
              <div>
                Estimated print weight (20% infill PLA): {estimatedWeightG != null && Number.isFinite(estimatedWeightG as number) ? `${(estimatedWeightG as number).toFixed(1)} g` : 'N/A'}
              </div>
            </div>
          )}
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
        </div>

        {/* Price summary */}
        <div className="rounded-xl border p-4 space-y-3">
          <div className="font-medium">Price</div>
          <div className="text-sm flex items-center justify-between">
            <span>Base (per unit)</span>
            <span>€{pricing.base.toFixed(2)}</span>
          </div>
          <div className="text-sm flex items-center justify-between">
            <span>Type: {pricing.typeLabel}{pricing.typePercent ? ` (+${pricing.typePercent}%)` : ''}</span>
            <span>€{pricing.typeSurcharge.toFixed(2)}</span>
          </div>
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
          <button
            onClick={onProceed}
            disabled={sizeErrors.length > 0}
            className="mt-2 w-full px-3 py-2 rounded-xl shadow text-sm border bg-black text-white disabled:opacity-50"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
