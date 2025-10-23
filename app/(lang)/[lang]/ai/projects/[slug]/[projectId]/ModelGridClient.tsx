'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import LazyGlb from '@/components/GlbViewer';
import { useDownloadModelMutation } from '@/app/(lang)/[lang]/ai/services/api';
import { useParams, useRouter, usePathname } from 'next/navigation';

function pickBestModelUrl(modelUrls?: Record<string, string | undefined>) {
  if (!modelUrls) return undefined;
  return modelUrls.glb || modelUrls.fbx || modelUrls.obj || modelUrls.usdz || undefined;
}

export type PublicModel = {
  id: string;
  prompt?: string;
  kind?: string;
  thumbnailUrl?: string | null;
  previewVideoUrl?: string | null;
  modelUrls?: Record<string, string | undefined>;
  createdAt: string | Date;
};

export default function ModelGridClient({ models }: { models: PublicModel[] }) {
  const [openUrl, setOpenUrl] = useState<string | null>(null);
  const [downloadModel] = useDownloadModelMutation();
  const params = useParams<{ lang: string }>();
  const lang = (params?.lang || 'en') as string;
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenUrl(null);
    };
    if (openUrl) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', onKey);
    } else {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    }
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [openUrl]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {models.map((m) => {
          const bestUrl = pickBestModelUrl(m.modelUrls);
          return (
            <div key={m.id} className="border rounded-lg overflow-hidden group">
              <button
                type="button"
                className="block w-full text-left"
                onClick={() => bestUrl && setOpenUrl(bestUrl)}
                disabled={!bestUrl}
                title={bestUrl ? 'Open 3D viewer' : 'No 3D file available'}
              >
                {m.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.thumbnailUrl} alt={m.prompt || '3D model'} className="w-full h-40 object-cover" />
                ) : (
                  <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400">No preview</div>
                )}
              </button>
              <div className="p-3 space-y-2">
                <div className="text-sm line-clamp-2">{m.prompt || '3D Model'}</div>
                <div className="text-xs text-gray-500 flex items-center justify-between">
                  <span>{(m.kind || '').toString()}</span>
                  <span>{new Date(m.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2 pt-1">
                  <Link
                    href={`/en/ai/purchase?modelId=${encodeURIComponent(m.id)}`}
                    className="px-3 py-1.5 text-sm rounded-md border bg-black text-white"
                  >
                    Buy
                  </Link>
                  {bestUrl ? (
                    <button
                      type="button"
                      className="px-3 py-1.5 text-sm rounded-md border hover:bg-gray-50"
                      onClick={async () => {
                        try {
                          const resp = await fetch(`/api/marketplace/models/${encodeURIComponent(m.id)}/entitlement`, { cache: 'no-store' });
                          if (resp.status === 401) {
                            const redirect = encodeURIComponent(pathname || `/` + lang + `/ai`);
                            router.push(`/${lang}/auth/login?redirect=${redirect}`);
                            return;
                          }
                          const ej = await resp.json().catch(() => ({ owned: false }));
                          const owned = !!ej?.owned;
                          if (!owned) {
                            const ok = window.confirm('This is gonna cost you 750 DC, do you want to download?');
                            if (!ok) return;
                          }
                          const res = await downloadModel({ modelId: m.id }).unwrap();
                          const url = (res as any)?.url;
                          if (url) window.open(url, '_blank');
                        } catch (e: any) {
                          const status = (e as any)?.status || (e as any)?.originalStatus;
                          if (status === 401) {
                            const redirect = encodeURIComponent(pathname || `/` + lang + `/ai`);
                            router.push(`/${lang}/auth/login?redirect=${redirect}`);
                            return;
                          }
                          if (status === 402) {
                            const go = window.confirm('Insufficient credits. Buy credits now?');
                            if (go) router.push(`/${lang}/credits`);
                            return;
                          }
                          if (status === 404) {
                            window.alert('OBJ file is not available for this model yet.');
                            return;
                          }
                          window.alert('Download failed. Please try again later.');
                        }
                      }}
                    >
                      Download
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {openUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setOpenUrl(null)}
        >
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setOpenUrl(null)}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center"
              aria-label="Close viewer"
            >
              <i className="ri-close-line text-xl" />
            </button>
          </div>
          <div className="w-full max-w-5xl max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
            <LazyGlb modelUrl={openUrl} className="w-full h-[70vh]" offMode="unmount" />
          </div>
        </div>
      )}
    </>
  );
}
