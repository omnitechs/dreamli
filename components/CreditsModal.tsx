"use client";

import { useEffect, useState } from "react";

type OpenEvt = CustomEvent<{ lang?: string; message?: string }>;

const getLangFromPath = () => {
  if (typeof window === "undefined") return "en";
  const seg = window.location.pathname.split("/")[1] || "en";
  return seg;
};

export default function CreditsModal() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<string>(getLangFromPath());
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const ev = e as OpenEvt;
      const det = ev.detail || {};
      setLang(det.lang || getLangFromPath());
      // Prefer message from event, then sessionStorage banner, else default
      let msg = det.message || null;
      try {
        if (!msg) msg = sessionStorage.getItem("insufficient_credits_msg");
        if (msg) sessionStorage.removeItem("insufficient_credits_msg");
      } catch {}
      setMessage(msg || "You are running out of Digital Credits (DC). Please add more to continue.");
      setOpen(true);
    };
    window.addEventListener("open-credits-modal", onOpen as EventListener);
    return () => {
      window.removeEventListener("open-credits-modal", onOpen as EventListener);
    };
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
      {/* modal */}
      <div className="relative z-10 w-[90%] max-w-sm rounded-2xl bg-white shadow-xl border p-5">
        <div className="text-base font-semibold mb-2">Low Digital Credits</div>
        <div className="text-sm text-gray-600 mb-4">
          {message}
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => setOpen(false)}
            className="px-3 py-2 rounded-xl border text-sm hover:bg-gray-50">
            Close
          </button>
          <button
            onClick={() => {
              const url = `/${lang || "en"}/credits`;
              try { window.open(url, "_blank", "noopener,noreferrer"); } catch { window.location.href = url; }
              setOpen(false);
            }}
            className="px-3 py-2 rounded-xl text-sm text-white bg-purple-600 hover:bg-purple-700">
            Buy Digital Credits
          </button>
        </div>
      </div>
    </div>
  );
}
