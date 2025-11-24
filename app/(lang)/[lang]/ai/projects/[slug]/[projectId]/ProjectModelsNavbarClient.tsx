"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useDownloadModelMutation } from "@/app/(lang)/[lang]/ai/services/api";
import type { ModelForViewer } from "./ProjectModelSectionClient";

function formatDate(d?: string | Date | null) {
  if (!d) return "";
  try {
    const dt = typeof d === "string" ? new Date(d) : d;
    return dt.toLocaleDateString();
  } catch {
    return "";
  }
}

const ORDERED_FORMATS = ["glb", "stl", "obj", "fbx", "gltf", "blend", "usd", "usdz"] as const;

type Props = {
  models: ModelForViewer[];
  activeId?: string;
  onActiveChange?: (id: string) => void;
};

export default function ProjectModelsNavbarClient({ models, activeId, onActiveChange }: Props) {
  const params = useParams<{ lang: string }>();
  const lang = (params?.lang || "en") as string;
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAuthed = !!(session as any)?.user?.id;

  const [downloadModel] = useDownloadModelMutation();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const list = useMemo(() => models || [], [models]);

  if (!list.length) return null;

  async function handleDownload(modelId: string, fmt: string | undefined) {
    const lower = (fmt || "").toLowerCase();
    const supportsGate = lower === "obj" || lower === "glb" || lower === "fbx" || lower === "usdz";

    if (!isAuthed) {
      const redirect = encodeURIComponent(pathname || `/${lang}/ai`);
      router.push(`/${lang}/auth/login?redirect=${redirect}`);
      return;
    }

    if (supportsGate) {
      try {
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
      try {
        const m = list.find((x) => x.id === modelId);
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

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-stretch gap-4 py-4 overflow-x-auto">
          {list.map((m, idx) => {
            const isActive = activeId ? m.id === activeId : idx === 0;
            const availableEntries = Object.entries(m.modelUrls || {}).filter(([, url]) => typeof url === "string" && !!url) as [string, string][];
            const ordered = (ORDERED_FORMATS as readonly string[])
              .map((fmt) => [fmt, (m.modelUrls as any)?.[fmt]] as [string, string | undefined])
              .filter(([, url]) => !!url) as [string, string][];
            const remaining = availableEntries.filter(([k]) => !(ORDERED_FORMATS as readonly string[]).includes(k as any));
            const formats = [...ordered, ...remaining];

            const thumb = m.thumbnailUrl || "/3dmodeling.avif";

            return (
              <div
                key={m.id || idx}
                className={`flex-shrink-0 flex items-center gap-4 px-4 py-3 rounded-xl border-2 transition-all cursor-pointer min-w-[280px] ${
                  isActive ? "border-teal-500 bg-teal-50" : "border-gray-200 bg-white hover:border-gray-300"
                }`}
                onClick={() => onActiveChange?.(m.id)}
                title={m.prompt || `Model ${idx + 1}`}
              >
                <div className="relative">
                  {/* Use img for external/data URLs; Next/Image for local assets */}
                  {/^https?:\/\//i.test(thumb) || /^data:/i.test(thumb) ? (
                    <img src={thumb} alt={m.prompt || `Model ${idx + 1}`} className="w-24 h-24 object-cover rounded-lg" />
                  ) : (
                    <Image src={thumb} alt={m.prompt || `Model ${idx + 1}`} width={96} height={96} className="w-24 h-24 object-cover rounded-lg" />
                  )}
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
                          setOpenDropdown(openDropdown === (m.id as any) ? null : (m.id as any));
                        }}
                        className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 whitespace-nowrap text-sm"
                        title="Download"
                      >
                        <i className="ri-download-line"></i>
                      </button>

                      {openDropdown === (m.id as any) && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdown(null);
                            }}
                          />
                          <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                            {formats.length ? (
                              formats.map(([fmt]) => (
                                <button
                                  key={fmt}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownload(m.id as string, fmt);
                                  }}
                                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
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
                        handlePurchase(m.id as string);
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
    </div>
  );
}
