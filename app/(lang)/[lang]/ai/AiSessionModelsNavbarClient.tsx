"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import useModels from "@/app/(lang)/[lang]/ai/hooks/useModels";
import { useDownloadModelMutation } from "@/app/(lang)/[lang]/ai/services/api";
import { createPortal } from "react-dom";

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

type Status = "PENDING" | "IN_PROGRESS" | "SUCCEEDED" | "FAILED" | "CANCELED" | string | undefined;

function statusStyles(status: Status) {
  const v = (status || "").toString().toUpperCase();
  switch (v) {
    case "PENDING":
      return { bg: "bg-gray-100", text: "text-gray-700", dot: "bg-gray-400" };
    case "IN_PROGRESS":
      return { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500" };
    case "SUCCEEDED":
      return { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500" };
    case "FAILED":
      return { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" };
    case "CANCELED":
      return { bg: "bg-yellow-100", text: "text-yellow-800", dot: "bg-yellow-500" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-700", dot: "bg-gray-400" };
  }
}

export default function AiSessionModelsNavbarClient() {
  const { models } = useModels();
  const [activeId, setActiveId] = useState<string | null>(null);
  const params = useParams<{ lang: string }>();
  const lang = (params?.lang || "en") as string;
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAuthed = !!(session as any)?.user?.id;
  const [downloadModel] = useDownloadModelMutation();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);

  const list = useMemo(() => (Array.isArray(models) ? models : []), [models]);
  const activeModel = useMemo(() => list.find((x: any) => x.id === openDropdown) as any, [list, openDropdown]);
  const activeFormats = useMemo(() => {
    if (!activeModel) return [] as [string, string][];
    const entries = Object.entries((activeModel as any)?.modelUrls || {}).filter(([, url]) => typeof url === "string" && !!url) as [string, string][];
    const ordered = (ORDERED_FORMATS as readonly string[])
      .map((fmt) => [fmt, ((activeModel as any)?.modelUrls || {})[fmt]] as [string, string | undefined])
      .filter(([, url]) => !!url) as [string, string][];
    const remaining = entries.filter(([k]) => !(ORDERED_FORMATS as readonly string[]).includes(k as any));
    return [...ordered, ...remaining];
  }, [activeModel]);

  useEffect(() => {
    // Select the latest by default if none is chosen
    if (!activeId && list.length) {
      setActiveId(list[0].id);
      try {
        window.dispatchEvent(new CustomEvent("ai-model-select", { detail: { modelId: list[0].id } } as any));
      } catch {}
    }
  }, [activeId, list]);

  // Close dropdown on scroll, resize, or Escape
  useEffect(() => {
    function close() {
      if (openDropdown) {
        setOpenDropdown(null);
        setMenuPos(null);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
      window.removeEventListener("keydown", onKey);
    };
  }, [openDropdown]);

  if (!list.length) return null;

  function handleSelect(id: string) {
    setActiveId(id);
    try {
      window.dispatchEvent(new CustomEvent("ai-model-select", { detail: { modelId: id } } as any));
    } catch {}
  }

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
        setMenuPos(null);
      }
    } else {
      try {
        const m = list.find((x: any) => x.id === modelId);
        const url = (m as any)?.modelUrls?.[lower];
        if (url) {
          window.open(url as string, "_blank");
        } else {
          window.alert("Format URL not available for this model.");
        }
      } finally {
        setOpenDropdown(null);
        setMenuPos(null);
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

  return (<>
    <div className="right-0 h-40 bg-white shadow-md z-50 overflow-x-auto overflow-y-visible">
      <div className="flex items-center gap-4 h-full px-6">
        {list.map((m: any, idx: number) => {
          const isActive = activeId ? m.id === activeId : idx === 0;
          const thumb: string = m?.thumbnailUrl || m?.imageUrls?.[0] || "/3dmodeling.avif";
          const sts = statusStyles(m?.status);
          const canPurchase = String(m?.status || "").toUpperCase() === "SUCCEEDED";

          // Compute available download formats
          const entries = Object.entries((m as any)?.modelUrls || {}).filter(([, url]) => typeof url === "string" && !!url) as [string, string][];
          const ordered = (ORDERED_FORMATS as readonly string[])
            .map((fmt) => [fmt, ((m as any)?.modelUrls || {})[fmt]] as [string, string | undefined])
            .filter(([, url]) => !!url) as [string, string][];
          const remaining = entries.filter(([k]) => !(ORDERED_FORMATS as readonly string[]).includes(k as any));
          const formats = [...ordered, ...remaining];

          return (
            <div
              key={m.id || idx}
              className={`flex-shrink-0 flex items-center gap-4 px-4 py-3 rounded-xl border-2 transition-all cursor-pointer min-w-[300px] ${
                isActive ? "border-teal-500 bg-teal-50" : "border-gray-200 bg-white hover:border-gray-300"
              }`}
              onClick={() => handleSelect(m.id)}
              title={m.prompt || `Model ${idx + 1}`}
            >
              <div className="relative">
                {/* Use img for external/data URLs; Next/Image requires domain config */}
                {/^https?:\/\//i.test(thumb) || /^data:/i.test(thumb) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={thumb} alt={m.prompt || `Model ${idx + 1}`} className="w-24 h-24 object-cover rounded-lg" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={thumb} alt={m.prompt || `Model ${idx + 1}`} className="w-24 h-24 object-cover rounded-lg" />
                )}
                {isActive && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                    <i className="ri-check-line text-white text-sm"></i>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 text-base whitespace-nowrap max-w-[180px] truncate">
                    {m.prompt ? (m.prompt.length > 28 ? `${m.prompt.slice(0, 28)}…` : m.prompt) : `Model ${idx + 1}`}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${sts.bg} ${sts.text}`}>
                    <span className={`w-2 h-2 rounded-full ${sts.dot}`}></span>
                    {String(m?.status || "").toUpperCase() || "—"}
                    {typeof m?.progress === "number" && (m?.status === "PENDING" || m?.status === "IN_PROGRESS") ? (
                      <span className="ml-1 opacity-70">{Math.round(Math.max(0, Math.min(100, m.progress)))}%</span>
                    ) : null}
                  </span>
                  <span className="text-sm text-gray-500 whitespace-nowrap">{formatDate(m?.createdAt)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const btn = e.currentTarget as HTMLElement;
                        const r = btn.getBoundingClientRect();
                        const MENU_W = 192; // 12rem (w-48)
                        const padding = 8;
                        const left = Math.min(
                          Math.max(padding + window.scrollX, r.left + window.scrollX),
                          window.scrollX + window.innerWidth - MENU_W - padding
                        );
                        const top = r.bottom + window.scrollY + 8; // 8px gap
                        if (openDropdown === (m.id as any)) {
                          setOpenDropdown(null);
                          setMenuPos(null);
                        } else {
                          setOpenDropdown(m.id as any);
                          setMenuPos({ top, left });
                        }
                      }}
                      className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 whitespace-nowrap text-sm"
                      title="Download"
                    >
                      <i className="ri-download-line"></i>
                    </button>

                    {false && openDropdown === (m.id as any) && null}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!canPurchase) return;
                      handlePurchase(m.id as string);
                    }}
                    disabled={!canPurchase}
                    title={canPurchase ? "Purchase this model" : "Purchase is available only after the model succeeds"}
                    className={`${canPurchase ? "bg-green-500 hover:bg-green-600 text-white" : "bg-gray-200 text-gray-500 cursor-not-allowed"} px-4 py-1.5 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap text-sm font-medium`}
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
    {openDropdown && menuPos ? createPortal(
      <>
        <div
          className="fixed inset-0 z-[9998]"
          onClick={() => { setOpenDropdown(null); setMenuPos(null); }}
        />
        <div
          className="fixed z-[9999] w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2"
          style={{ top: menuPos.top, left: menuPos.left }}
        >
          {activeFormats.length ? (
            activeFormats.map(([fmt]) => (
              <button
                key={fmt}
                onClick={(e) => { e.stopPropagation(); handleDownload(openDropdown as string, fmt); }}
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
      </>,
      typeof document !== 'undefined' ? document.body : (null as any)
    ) : null}
  </>
  );
}
