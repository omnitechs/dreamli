"use client";

import React, { useMemo, useState } from "react";
import LazyGlb from "@/components/GlbViewer";

export type ModelForViewer = {
  id: string;
  prompt?: string | null;
  createdAt?: string | Date | null;
  thumbnailUrl?: string | null;
  modelUrls?: Partial<Record<"glb" | "fbx" | "obj" | "usdz" | "stl", string | undefined>>;
};

function pickBestUrl(urls?: ModelForViewer["modelUrls"]) {
  if (!urls) return undefined;
  // Only return formats our viewer supports
  return urls.glb || urls.stl || undefined;
}

export default function ProjectModelSectionClient({ models, activeId: controlledId, onActiveChange }: { models: ModelForViewer[]; activeId?: string; onActiveChange?: (id: string) => void; }) {
  const sorted = useMemo(() => {
    return [...models].sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }, [models]);

  const [uncontrolledId, setUncontrolledId] = useState<string>(sorted[0]?.id || "");
  const activeId = controlledId ?? uncontrolledId;
  const setActiveId = onActiveChange ?? setUncontrolledId;
  const supported = useMemo(() => sorted.filter((m) => !!pickBestUrl(m.modelUrls)), [sorted]);
  const active = useMemo(() => supported.find((m) => m.id === activeId) || supported[0] || sorted[0], [supported, sorted, activeId]);
  const activeUrl = pickBestUrl(active?.modelUrls);

  return (
    <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900">3D Model</h2>
      </div>
      {sorted.length > 1 ? (
        <div className="mb-6 -mx-2 px-2 overflow-x-auto sm:overflow-visible">
          <div className="flex gap-2 whitespace-nowrap sm:flex-wrap sm:whitespace-normal">
            {sorted.map((m, idx) => {
              const previewUrl = pickBestUrl(m.modelUrls);
              const isActive = active?.id === m.id;
              const disabled = !previewUrl;
              return (
                <button
                  key={m.id}
                  onClick={() => !disabled && setActiveId(m.id)}
                  disabled={disabled}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                    isActive ? "bg-blue-600 text-white border-blue-600" : disabled ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                  title={disabled ? "No 3D preview available for this model" : (m.prompt || `Model ${idx + 1}`)}
                >
                  Model {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mb-6" />
      )}

      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden">
        {activeUrl ? (
          <LazyGlb modelUrl={activeUrl} offMode="pause" rootMargin="600px 0px" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            No 3D preview available for this model
          </div>
        )}
      </div>

      {active?.prompt ? (
        <p className="text-sm text-gray-500 mt-3">{active.prompt}</p>
      ) : null}
    </section>
  );
}
