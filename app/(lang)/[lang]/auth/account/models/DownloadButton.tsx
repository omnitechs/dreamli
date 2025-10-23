"use client";

import React from "react";
import { useRouter, usePathname, useParams } from "next/navigation";

export default function DownloadButton({ modelId, className }: { modelId: string; className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ lang: string }>();
  const lang = (params?.lang || "en") as string;

  async function onClick() {
    try {
      // We are in the purchased list: user already owns entitlement.
      const res = await fetch(`/api/marketplace/models/${encodeURIComponent(modelId)}/download`, { method: "POST" });
      if (res.status === 401) {
        const redirect = encodeURIComponent(pathname || `/${lang}/auth/account/models`);
        router.push(`/${lang}/auth/login?redirect=${redirect}`);
        return;
      }
      if (!res.ok) {
        if (res.status === 402) {
          const go = window.confirm("Insufficient credits. Buy credits now?");
          if (go) router.push(`/${lang}/credits`);
          return;
        }
        if (res.status === 404) {
          window.alert("OBJ file is not available for this model yet.");
          return;
        }
        window.alert("Download failed. Please try again later.");
        return;
      }
      const data = await res.json().catch(() => ({} as any));
      const url = (data as any)?.url;
      if (url) window.open(url, "_blank");
    } catch {
      window.alert("Download failed. Please try again later.");
    }
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      Download
    </button>
  );
}
