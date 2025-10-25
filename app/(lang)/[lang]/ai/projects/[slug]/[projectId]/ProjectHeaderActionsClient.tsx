"use client";

import React, { useMemo, useState } from "react";
import { Heart, Share2, Download, ChevronDown } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import {
  useGetModelLikesQuery,
  useLikeModelMutation,
  useUnlikeModelMutation,
} from "@/app/(lang)/[lang]/ai/services/api";
import { useDownloadModelMutation, useGetModelByIdQuery } from "@/app/(lang)/[lang]/ai/services/api";

export default function ProjectHeaderActionsClient({ modelId }: { modelId?: string | null }) {
  const { data: session } = useSession();
  const isAuthed = !!(session as any)?.user?.id;
  const pathname = usePathname();
  const router = useRouter();

  const effectiveModelId = (modelId || "").toString();

  const { data: likesData } = useGetModelLikesQuery(
    { modelId: effectiveModelId },
    { skip: !effectiveModelId }
  );
  const [likeModel] = useLikeModelMutation();
  const [unlikeModel] = useUnlikeModelMutation();
  const [downloadModel] = useDownloadModelMutation();

  // Formats menu state
  const [formatsOpen, setFormatsOpen] = useState(false);
  const { data: modelData } = useGetModelByIdQuery(
    { modelId: effectiveModelId },
    { skip: !effectiveModelId }
  );

  const liked = !!likesData?.userLiked;
  const likesCount = Number(likesData?.count || 0);

  const lang = useMemo(() => {
    // Extract lang from /{lang}/... path
    const seg = (pathname || "/en").split("/").filter(Boolean)[0];
    return seg || "en";
  }, [pathname]);

  async function ensureAuth(): Promise<boolean> {
    if (isAuthed) return true;
    const redirect = encodeURIComponent(pathname || "/" + lang);
    router.push(`/${lang}/auth/login?redirect=${redirect}`);
    return false;
  }

  async function onToggleLike() {
    if (!effectiveModelId) return;
    if (!(await ensureAuth())) return;
    try {
      if (liked) await unlikeModel({ modelId: effectiveModelId }).unwrap();
      else await likeModel({ modelId: effectiveModelId }).unwrap();
    } catch (e) {
      // no-op: RTK Query will surface errors if needed
    }
  }

  async function onShare() {
    try {
      if (navigator.share) {
        await navigator.share({ url: window.location.href, title: document.title });
        return;
      }
    } catch {}
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard");
    } catch {
      // fallback prompt
      prompt("Copy this link", window.location.href);
    }
  }

  async function performDownload(format?: 'obj'|'glb'|'fbx'|'usdz') {
    if (!effectiveModelId) return;
    if (!(await ensureAuth())) return;

    try {
      const resp = await fetch(`/api/marketplace/models/${encodeURIComponent(effectiveModelId)}/entitlement`, { cache: "no-store" });
      if (resp.status === 401) {
        const redirect = encodeURIComponent(pathname || `/${lang}`);
        router.push(`/${lang}/auth/login?redirect=${redirect}`);
        return;
      }
      const ej = await resp.json().catch(() => ({ owned: false }));
      const owned = !!ej?.owned;
      if (!owned) {
        const ok = window.confirm("This is gonna cost you 750 DC, do you want to download?");
        if (!ok) return;
      }
      const res = await downloadModel({ modelId: effectiveModelId, format }).unwrap();
      const url = (res as any)?.url;
      if (url) window.open(url, "_blank");
    } catch (e: any) {
      const status = e?.status || e?.originalStatus;
      if (status === 401) {
        const redirect = encodeURIComponent(pathname || `/${lang}`);
        router.push(`/${lang}/auth/login?redirect=${redirect}`);
        return;
      }
      if (status === 402) {
        const go = window.confirm("You have insufficient credits to download this model. Buy credits now?");
        if (go) router.push(`/${lang}/credits`);
        return;
      }
      if (status === 404) {
        window.alert("Requested file is not available for this model yet.");
        return;
      }
      window.alert("Download failed. Please try again later.");
    }
  }

  async function onDownload() {
    await performDownload();
  }

  const availableFormats = useMemo(() => {
    const urls = (modelData as any)?.modelUrls || {};
    const fmts: Array<'obj'|'glb'|'fbx'|'usdz'> = [];
    if (urls.obj) fmts.push('obj');
    if (urls.glb) fmts.push('glb');
    if (urls.fbx) fmts.push('fbx');
    if (urls.usdz) fmts.push('usdz');
    return fmts;
  }, [modelData]);

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onToggleLike}
        disabled={!effectiveModelId}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
          liked ? "bg-red-50 text-red-600 border-2 border-red-200" : "bg-white text-gray-700 border-2 border-gray-200 hover:border-red-200"
        } ${!effectiveModelId ? "opacity-50 cursor-not-allowed" : ""}`}
        title={liked ? "Unlike" : "Like"}
      >
        <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
        <span className="font-semibold">{likesCount}</span>
      </button>
      <button
        onClick={onShare}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-200 transition-colors whitespace-nowrap cursor-pointer"
        title="Share"
      >
        <Share2 className="w-5 h-5" />
        <span>Share</span>
      </button>
      <div className="relative">
        <button
          onClick={onDownload}
          disabled={!effectiveModelId}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer ${
            !effectiveModelId ? "opacity-50 cursor-not-allowed" : ""
          }`}
          title="Download"
          onMouseEnter={() => setFormatsOpen(true)}
          onMouseLeave={() => setFormatsOpen(false)}
        >
          <Download className="w-5 h-5" />
          <span>Download</span>
          <ChevronDown className="w-4 h-4 opacity-80" />
        </button>
        {formatsOpen && availableFormats.length > 0 ? (
          <div className="absolute right-0 mt-2 w-40 rounded-xl border bg-white shadow-lg z-10" onMouseEnter={() => setFormatsOpen(true)} onMouseLeave={() => setFormatsOpen(false)}>
            {availableFormats.map((fmt) => (
              <button
                key={fmt}
                onClick={() => performDownload(fmt)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
              >
                Download .{fmt.toUpperCase()}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
