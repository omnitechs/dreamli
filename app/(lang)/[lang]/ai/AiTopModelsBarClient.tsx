"use client";

import React, { useMemo, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  useDownloadModelMutation,
} from "@/app/(lang)/[lang]/ai/services/api";

// Marketplace item shape (subset)
export type MarketplaceModelItem = {
  id: string;
  prompt?: string | null;
  thumbnailUrl?: string | null;
  createdAt?: string | Date | null;
  modelUrls?: Record<string, string | undefined> | null;
};

const ORDERED_FORMATS = ["glb", "stl", "obj", "fbx", "gltf", "blend", "usd", "usdz"] as const;

function formatDate(d?: string | Date | null) {
  if (!d) return "";
  try {
    const dt = typeof d === "string" ? new Date(d) : d;
    return dt.toLocaleDateString();
  } catch {
    return "";
  }
}

export default function AiTopModelsBarClient({ items }: { items: MarketplaceModelItem[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const params = useParams<{ lang: string }>();
  const lang = (params?.lang || "en") as string;
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAuthed = !!(session as any)?.user?.id;

  const [downloadModel] = useDownloadModelMutation();

  const models = useMemo(() => items || [], [items]);

  async function handleDownload(modelId: string, fmt: string | undefined) {
    // For formats handled by our gated API, use mutation; else open direct URL from modelUrls if present
    const lower = (fmt || "").toLowerCase();
    const supportsGate = lower === "obj" || lower === "glb" || lower === "fbx" || lower === "usdz";

    if (!isAuthed) {
      const redirect = encodeURIComponent(pathname || `/${lang}/ai`);
      router.push(`/${lang}/auth/login?redirect=${redirect}`);
      return;
    }

    if (supportsGate) {
      try {
        // Check entitlement
        const resp = await fetch(`/api/marketplace/models/${encodeURIComponent(modelId)}/entitlement`, { cache: "no-store" });
        if (resp.status === 401) {
          const redirect = encodeURIComponent(pathname || `/${lang}/ai`);
          router.push(`/${lang}/auth/login?redirect=${redirect}`);
          return;
        }
        const ej = await resp.json().catch(() => ({ owned: false }));
        const owned = !!ej?.owned;
        if (!owned) {
          const ok = window.confirm("This will cost 750 DC, proceed to download?");
          if (!ok) return;
        }
        const res = await downloadModel({ modelId, format: (lower || undefined) as any }).unwrap();
        const url = (res as any)?.url;
        if (url) window.open(url, "_blank");
      } catch (e: any) {
        const status = e?.status || e?.originalStatus;
        if (status === 401) {
          const redirect = encodeURIComponent(pathname || `/${lang}/ai`);
          router.push(`/${lang}/auth/login?redirect=${redirect}`);
          return;
        }
        if (status === 402) {
          const go = window.confirm("You have insufficient credits to download this model. Buy credits now?");
          if (go) router.push(`/${lang}/credits`);
          return;
        }
        if (status === 404) {
          window.alert("Selected format is not available for this model.");
          return;
        }
        window.alert("Download failed. Please try again later.");
      } finally {
        setOpenDropdown(null);
      }
    } else {
      // Fallback: open direct URL for non-gated formats if available
      try {
        const m = models.find((x) => x.id === modelId);
        const url = (m as any)?.modelUrls?.[lower];
        if (url) {
          window.open(url as string, "_blank");
        } else {
          window.alert("Format URL not available for this model.");
        }
      } finally {
        setOpenDropdown(null);
      }
    }
  }

  function handlePurchase(modelId: string) {
    if (!isAuthed) {
      const redirect = encodeURIComponent(pathname || `/${lang}/ai`);
      router.push(`/${lang}/auth/login?redirect=${redirect}`);
      return;
    }
    router.push(`/${lang}/ai/purchase?modelId=${encodeURIComponent(modelId)}`);
  }

  if (!models.length) return null;

  return (
    <div className="fixed top-0 left-0 right-0 h-28 sm:h-40 bg-white shadow-md z-50 overflow-x-auto overflow-y-visible snap-x snap-mandatory" style={{ WebkitOverflowScrolling: 'touch' }}>
      <div className="flex items-center gap-2 sm:gap-4 h-full px-3 sm:px-6">
        {models.map((m, idx) => {
          const isActive = selectedId ? selectedId === m.id : idx === 0;

          const availableEntries = Object.entries(m.modelUrls || {}).filter(([, url]) => typeof url === "string" && !!url) as [string, string][];
          const ordered = (ORDERED_FORMATS as readonly string[])
            .map((fmt) => [fmt, (m.modelUrls as any)?.[fmt]] as [string, string | undefined])
            .filter(([, url]) => !!url) as [string, string][];
          const remaining = availableEntries.filter(([k]) => !(ORDERED_FORMATS as readonly string[]).includes(k as any));
          const formats = [...ordered, ...remaining];

          const thumb = m.thumbnailUrl || "/3dmodeling.avif";

          return (
            <div
              key={m.id}
              className={`flex-shrink-0 snap-start flex items-center gap-3 px-3 py-2 sm:gap-4 sm:px-4 sm:py-3 rounded-xl border-2 transition-all cursor-pointer ${
                isActive ? "border-teal-500 bg-teal-50" : "border-gray-200 bg-white hover:border-gray-300"
              }`}
              onClick={() => setSelectedId(selectedId === m.id ? null : m.id)}
            >
              <div className="relative">
                <img src={thumb} alt={m.prompt || `Model ${idx + 1}`} className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg" />
                {isActive && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                    <i className="ri-check-line text-white text-sm"></i>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <div>
                  <h3 className="font-semibold text-gray-900 text-base whitespace-nowrap">
                    {m.prompt ? (m.prompt.length > 28 ? `${m.prompt.slice(0, 28)}…` : m.prompt) : `Model ${idx + 1}`}
                  </h3>
                  <p className="text-sm text-gray-500">{formatDate(m.createdAt)}</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdown(openDropdown === m.id ? null : m.id);
                      }}
                      className="px-2 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 whitespace-nowrap"
                      title="Download"
                    >
                      <i className="ri-download-line"></i>
                    </button>

                    {openDropdown === m.id && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDropdown(null);
                          }}
                        />
                        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 flex flex-col whitespace-normal max-h-72 overflow-auto">
                          {formats.length ? (
                            formats.map(([fmt]) => (
                              <button
                                key={fmt}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownload(m.id, fmt);
                                }}
                                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors block"
                              >
                                <i className="ri-file-3d-line text-gray-400"></i>
                                <span className="text-sm text-gray-700">{fmt.toUpperCase()}</span>
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-2 text-sm text-gray-400">No formats</div>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePurchase(m.id);
                    }}
                    className="px-4 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 whitespace-nowrap text-sm font-medium"
                  >
                    <i className="ri-shopping-cart-line"></i>
                    Purchase
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
