'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';


// Dynamically load the heavy viewer on demand
const ModelViewer = dynamic(() => import('./ModelViewer'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-80 bg-gray-50 rounded-lg grid place-items-center">
            <span className="text-sm text-gray-500">Loading 3D viewer…</span>
        </div>
    ),
});

type LazyGlbProps = {
    modelUrl: string;
    className?: string;
    /** how early (in px) to start loading before it hits viewport */
    rootMargin?: string; // e.g. '600px 0px'
    forceType?: 'glb' | 'stl';
    width?: number;
    height?: number;
    poster?: string; // optional placeholder image
};

export default function LazyGlb({
                                    modelUrl,
                                    className = '',
                                    rootMargin = '600px 0px', // start loading early
                                    forceType,
                                    width,
                                    height,
                                    poster,
                                }: LazyGlbProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!ref.current || visible) return;

        const el = ref.current;
        const obs = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setVisible(true);
                    obs.disconnect();
                }
            },
            { root: null, rootMargin, threshold: 0.01 }
        );

        obs.observe(el);
        return () => obs.disconnect();
    }, [visible, rootMargin]);

    // Optional: warm up the model file when user shows intent (hover/touch)
    const prefetchModel = () => {
        if (typeof document === 'undefined') return;
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'fetch';
        link.href = modelUrl;
        // Some CDNs like a type hint; safe to omit if unknown
        // @ts-ignore
        link.type = 'model/gltf-binary';
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
    };

    return (
        <div
            ref={ref}
            className={`relative ${className}`}
            onMouseEnter={prefetchModel}
            onTouchStart={prefetchModel}
            style={{ width, height }}
        >
            {!visible ? (
                <div className="w-full h-80 bg-gray-50 rounded-lg grid place-items-center">
                    {poster ? (
                        // Poster image placeholder (if provided)
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={poster} alt="" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                        <span className="text-sm text-gray-500">3D preview will load when in view…</span>
                    )}
                </div>
            ) : (
                <ModelViewer modelUrl={modelUrl} className={className} forceType={forceType} />
            )}
        </div>
    );
}
