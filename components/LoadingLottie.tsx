"use client";

import React, { useEffect, useRef } from "react";

/**
 * Loading screen that plays the public/3D Printer.json Lottie animation.
 * Uses lottie-web via a dynamically injected CDN script (no extra npm deps).
 */
export default function LoadingLottie({
  fullScreen = true,
  label = "Loading...",
  size = 160,
}: {
  fullScreen?: boolean;
  label?: string;
  size?: number;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;

    async function ensureLottieLoaded() {
      const w = window as any;
      if (w.lottie) return w.lottie;
      if (w.__lottieLoadingPromise) return w.__lottieLoadingPromise;
      w.__lottieLoadingPromise = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js";
        script.async = true;
        script.onload = () => resolve((window as any).lottie);
        script.onerror = reject;
        document.head.appendChild(script);
      });
      return w.__lottieLoadingPromise;
    }

    async function start() {
      try {
        const lottie = await ensureLottieLoaded();
        if (!isMounted || !containerRef.current || !lottie) return;
        // Destroy previous instance if any
        if (animRef.current) {
          try { animRef.current.destroy(); } catch {}
          animRef.current = null;
        }
        animRef.current = lottie.loadAnimation({
          container: containerRef.current,
          renderer: "svg",
          loop: true,
          autoplay: true,
          path: "/3D%20Printer.json",
          rendererSettings: {
            preserveAspectRatio: "xMidYMid meet",
          },
        });
      } catch (e) {
        // Silently fail, keep fallback UI
        console.error("Failed to load lottie-web:", e);
      }
    }

    start();

    return () => {
      isMounted = false;
      if (animRef.current) {
        try { animRef.current.destroy(); } catch {}
      }
      animRef.current = null;
    };
  }, []);

  return (
    <div
      className={
        fullScreen
          ? "min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center"
          : "w-full h-full flex items-center justify-center"
      }
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className="flex flex-col items-center justify-center gap-4">
        <div
          ref={containerRef}
          style={{ width: size, height: size }}
          className="select-none"
        />
        <p className="text-sm text-gray-600">{label}</p>
      </div>
    </div>
  );
}
