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
  return urls.glb || urls.fbx || urls.obj || urls.usdz || urls.stl || undefined;
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
  const active = useMemo(() => sorted.find((m) => m.id === activeId) || sorted[0], [sorted, activeId]);
  const activeUrl = pickBestUrl(active?.modelUrls);

  return (
    <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">3D Model</h2>
        {sorted.length > 1 ? (
          <div className="flex flex-wrap gap-2">
            {sorted.map((m, idx) => (
              <button
                key={m.id}
                onClick={() => setActiveId(m.id)}
                className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                  active?.id === m.id ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
                title={m.prompt || `Model ${idx + 1}`}
              >
                Model {idx + 1}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden">
        {activeUrl ? (
          <LazyGlb modelUrl={activeUrl} />
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
