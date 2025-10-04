'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const ModelViewer = dynamic(() => import('./ModelViewer'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-80 bg-gray-50 rounded-lg grid place-items-center">
            <span className="text-sm text-gray-500">Loading 3D viewer…</span>
        </div>
    ),
});

type OffMode = 'unmount' | 'pause';

type LazyGlbProps = {
    modelUrl: string;
    className?: string;
    /** start loading before it hits viewport */
    rootMargin?: string; // e.g. '600px 0px'
    forceType?: 'glb' | 'stl';
    width?: number;
    height?: number;
    poster?: string;
    /** what to do when not visible */
    offMode?: OffMode; // 'unmount' = remove viewer, 'pause' = keep but stop loop
    /** avoid rapid flip-flop while scrolling */
    exitDebounceMs?: number; // default 200
};

export default function LazyGlb({
                                    modelUrl,
                                    className = '',
                                    rootMargin = '600px 0px',
                                    forceType,
                                    width,
                                    height,
                                    poster,
                                    offMode = 'unmount',
                                    exitDebounceMs = 200,
                                }: LazyGlbProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    const tRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!ref.current) return;
        const el = ref.current;

        const io = new IntersectionObserver(
            (entries) => {
                const e = entries[0];
                if (e.isIntersecting) {
                    if (tRef.current) clearTimeout(tRef.current);
                    setVisible(true);
                } else {
                    if (tRef.current) clearTimeout(tRef.current);
                    tRef.current = setTimeout(() => setVisible(false), exitDebounceMs);
                }
            },
            { root: null, rootMargin, threshold: 0.01 }
        );

        io.observe(el);
        return () => {
            io.disconnect();
            if (tRef.current) clearTimeout(tRef.current);
        };
    }, [rootMargin, exitDebounceMs]);

    // Optional warm-up
    const prefetchModel = () => {
        if (typeof document === 'undefined') return;
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'fetch';
        link.href = modelUrl;
        // @ts-ignore
        link.type = 'model/gltf-binary';
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
    };

    const style = { width, height } as React.CSSProperties;

    return (
        <div
            ref={ref}
            className={`relative ${className}`}
            onMouseEnter={prefetchModel}
            onTouchStart={prefetchModel}
            style={style}
        >
            {offMode === 'unmount' ? (
                visible ? (
                    <ModelViewer
                        modelUrl={modelUrl}
                        className={className}
                        forceType={forceType}
                        active
                    />
                ) : poster ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={poster} alt="" className="w-full h-full object-cover rounded-lg" />
                ) : (
                    <div className="w-full h-80 bg-gray-50 rounded-lg grid place-items-center">
                        <span className="text-sm text-gray-500">Scroll to view 3D…</span>
                    </div>
                )
            ) : (
                <ModelViewer
                    modelUrl={modelUrl}
                    className={className}
                    forceType={forceType}
                    active={visible}   // <- soft off
                />
            )}
        </div>
    );
}
