"use client";

import React, { useMemo, useState } from "react";

export type RefImage = { id: string; url: string; commitId?: string; createdAtMs?: number };

export default function ReferenceImagesClient({ images }: { images: RefImage[] }) {
  const list = useMemo(() => images || [], [images]);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const current = openIdx != null ? list[openIdx] : null;

  function onDownload(url: string) {
    try {
      const a = document.createElement('a');
      a.href = url;
      // filename hint
      const name = url.split('?')[0].split('#')[0].split('/').pop() || 'image.jpg';
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      window.open(url, '_blank');
    }
  }

  return (
    <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Reference Images</h2>
      {!list.length ? (
        <div className="text-sm text-gray-500">No images in this project.</div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {list.map((im, idx) => (
            <button key={im.id} className="group text-left" onClick={() => setOpenIdx(idx)}>
              <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-3 border border-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={im.url} alt={im.id} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <p className="text-sm font-medium text-gray-700 capitalize text-center">Image {idx + 1}</p>
            </button>
          ))}
        </div>
      )}

      {current ? (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setOpenIdx(null)}>
          <div className="bg-white rounded-2xl w-full max-w-5xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="text-sm font-medium truncate">{current.id}</div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 text-sm rounded-md border bg-white hover:bg-gray-50" onClick={() => window.open(current.url, '_blank')}>Open in new tab</button>
                <button className="px-3 py-1.5 text-sm rounded-md border bg-blue-600 text-white hover:bg-blue-700" onClick={() => onDownload(current.url)}>Download</button>
                <button className="px-3 py-1.5 text-sm rounded-md border" onClick={() => setOpenIdx(null)}>Close</button>
              </div>
            </div>
            <div className="max-h-[80vh] overflow-auto bg-gray-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={current.url} alt={current.id} className="w-full h-auto object-contain" />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
