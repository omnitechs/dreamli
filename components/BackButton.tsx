"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Floating Back Button
 * - Always rendered to avoid layout shift (CLS). Visibility toggled via opacity/pointer-events.
 * - Draggable: users can drag and drop it anywhere; position persists in localStorage per browser.
 * - Defaults to bottom-left with safe-area padding when no saved position exists.
 * - Calls router.back() on click.
 */
export default function BackButton() {
  const router = useRouter();
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const [canGoBack, setCanGoBack] = useState(false);

  // Persisted position (left, top in CSS pixels). If null, use default bottom-left.
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const dragOffsetRef = useRef<{ dx: number; dy: number }>({ dx: 0, dy: 0 });
  const pointerIdRef = useRef<number | null>(null);

  // Long-press drag management
  const longPressTimerRef = useRef<number | null>(null);
  const startPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const suppressClickRef = useRef<boolean>(false);

  const STORAGE_KEY = "backButtonPos:v1";
  const PADDING = 12; // pixels from edges
  const LONG_PRESS_MS = 300; // hold time to start dragging
  const MOVE_CANCEL_PX = 6; // small movement allowed before long-press is canceled
  const DRAG_START_PX = 12; // for touch: movement threshold to start dragging immediately

  // Initialize canGoBack and subscribe to history changes.
  useEffect(() => {
    try {
      const len = window.history.length || 0;
      setCanGoBack(len > 1);
    } catch (_) {
      setCanGoBack(false);
    }

    const onPop = () => {
      try {
        setCanGoBack((window.history.length || 0) > 1);
      } catch (_) {
        // ignore
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Load saved position on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (
        saved &&
        typeof saved.x === "number" &&
        typeof saved.y === "number" &&
        isFinite(saved.x) &&
        isFinite(saved.y)
      ) {
        // Clamp to current viewport
        const rect = btnRef.current?.getBoundingClientRect();
        const w = rect?.width || 56;
        const h = rect?.height || 40;
        const maxX = Math.max(0, window.innerWidth - w - PADDING);
        const maxY = Math.max(0, window.innerHeight - h - PADDING);
        setPos({ x: Math.min(Math.max(PADDING, saved.x), maxX), y: Math.min(Math.max(PADDING, saved.y), maxY) });
      }
    } catch (_) {
      // ignore
    }
  }, []);

  // When hidden (no back possible), ensure we are not dragging.
  useEffect(() => {
    if (!canGoBack && dragging) {
      setDragging(false);
      pointerIdRef.current = null;
    }
  }, [canGoBack, dragging]);

  // Clamp position on window resize so the button stays visible.
  useEffect(() => {
    const onResize = () => {
      if (!pos) return;
      const rect = btnRef.current?.getBoundingClientRect();
      const w = rect?.width || 56;
      const h = rect?.height || 40;
      const maxX = Math.max(0, window.innerWidth - w - PADDING);
      const maxY = Math.max(0, window.innerHeight - h - PADDING);
      setPos({ x: Math.min(Math.max(PADDING, pos.x), maxX), y: Math.min(Math.max(PADDING, pos.y), maxY) });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [pos]);

  const hidden = !canGoBack;

  // Pointer event handlers for drag
  function onPointerDown(e: React.PointerEvent<HTMLButtonElement>) {
    if (hidden) return;
    e.preventDefault();
    try {
      const el = btnRef.current;
      if (!el) return;

      // Record pointer and initial position; do NOT start dragging yet.
      pointerIdRef.current = e.pointerId;
      const rect = el.getBoundingClientRect();
      dragOffsetRef.current = { dx: e.clientX - rect.left, dy: e.clientY - rect.top };
      startPosRef.current = { x: e.clientX, y: e.clientY };
      suppressClickRef.current = false;

      // Start long-press timer to enter drag mode
      if (longPressTimerRef.current) window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = window.setTimeout(() => {
        // Begin dragging after sufficient hold
        try {
          el.setPointerCapture(e.pointerId);
        } catch (_) {
          // ignore
        }
        setDragging(true);
        suppressClickRef.current = true; // we are dragging; do not navigate on click
      }, LONG_PRESS_MS);
    } catch (_) {
      // ignore
    }
  }

  function onPointerMove(e: React.PointerEvent<HTMLButtonElement>) {
    if (pointerIdRef.current !== e.pointerId) return;

    // If not dragging yet, decide how to proceed based on movement and input type
    if (!dragging) {
      const dxAbs = Math.abs(e.clientX - startPosRef.current.x);
      const dyAbs = Math.abs(e.clientY - startPosRef.current.y);
      const movedFar = dxAbs > MOVE_CANCEL_PX || dyAbs > MOVE_CANCEL_PX;

      // On touch, if the user starts moving finger more than DRAG_START_PX, start dragging immediately
      if (e.pointerType === "touch") {
        const movedEnoughToDrag = dxAbs > DRAG_START_PX || dyAbs > DRAG_START_PX;
        if (movedEnoughToDrag) {
          if (longPressTimerRef.current) {
            window.clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
          }
          const el = btnRef.current;
          if (el) {
            try {
              el.setPointerCapture(e.pointerId);
            } catch (_) {
              // ignore
            }
            setDragging(true);
            suppressClickRef.current = true;
          }
        } else {
          // Not enough movement yet; wait for long-press
          return;
        }
      } else {
        // Mouse/pen: cancel long-press if user moved, keep normal click behavior
        if (movedFar) {
          if (longPressTimerRef.current) {
            window.clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
          }
        }
        return;
      }
    }

    // Dragging: update position
    const el = btnRef.current;
    if (!el) return;
    e.preventDefault();
    const rect = el.getBoundingClientRect();
    const w = rect.width || 56;
    const h = rect.height || 40;
    const maxX = Math.max(0, window.innerWidth - w - PADDING);
    const maxY = Math.max(0, window.innerHeight - h - PADDING);
    const { dx, dy } = dragOffsetRef.current;
    const nextX = Math.min(Math.max(PADDING, e.clientX - dx), maxX);
    const nextY = Math.min(Math.max(PADDING, e.clientY - dy), maxY);
    setPos({ x: nextX, y: nextY });
  }

  function onPointerUp(e: React.PointerEvent<HTMLButtonElement>) {
    if (pointerIdRef.current !== e.pointerId) return;

    // Clear any pending long-press
    if (longPressTimerRef.current) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    // If we were dragging, end drag and persist position
    if (dragging) {
      try {
        btnRef.current?.releasePointerCapture(e.pointerId);
      } catch (_) {
        // ignore
      }
      setDragging(false);
      pointerIdRef.current = null;
      try {
        if (pos) localStorage.setItem(STORAGE_KEY, JSON.stringify(pos));
      } catch (_) {
        // ignore
      }
    } else {
      // Not dragging: allow normal click; ensure we don't suppress it
      suppressClickRef.current = false;
      pointerIdRef.current = null;
    }
  }

  function onPointerCancel(e: React.PointerEvent<HTMLButtonElement>) {
    if (pointerIdRef.current !== e.pointerId) return;
    if (longPressTimerRef.current) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    try {
      btnRef.current?.releasePointerCapture(e.pointerId);
    } catch (_) {
      // ignore
    }
    setDragging(false);
    pointerIdRef.current = null;
    suppressClickRef.current = false;
  }

  function handleClick() {
    if (hidden) return;
    if (suppressClickRef.current) {
      // A drag just happened or was initiated; do not navigate back.
      suppressClickRef.current = false;
      return;
    }
    router.back();
  }

  const style: React.CSSProperties = {
    ...(pos
      ? { left: `${pos.x}px`, top: `${pos.y}px`, bottom: "auto" }
      : { left: "16px", bottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)" }),
    touchAction: "none",
    willChange: dragging ? ("left, top" as any) : undefined,
  };

  const visibilityClasses = hidden
    ? "opacity-0 pointer-events-none"
    : "opacity-100 hover:bg-white";

  const dragClasses = dragging ? "cursor-grabbing" : "cursor-grab";

  return (
    <button
      ref={btnRef}
      type="button"
      aria-label="Go back"
      aria-hidden={hidden}
      tabIndex={hidden ? -1 : 0}
      disabled={hidden}
      onClick={handleClick}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      className={[
        "fixed z-50 inline-flex items-center gap-2 rounded-full border bg-white/90 backdrop-blur px-3 py-2 text-sm shadow focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 select-none",
        "transition-opacity duration-200",
        visibilityClasses,
        dragClasses,
      ].join(" ")}
      style={style}
    >
      <i className="ri-arrow-left-line" aria-hidden />
      <span className="hidden sm:inline">Back</span>
    </button>
  );
}
