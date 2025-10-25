'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Heart, MessageCircle, Clock } from 'lucide-react';
import {
  useGetMarketplaceModelsQuery,
  useLikeModelMutation,
  useUnlikeModelMutation,
  useGetModelPrintsQuery,
  useAddModelPrintMutation,
  usePresignUploadMutation,
  useGetModelLikesQuery,
} from '@/app/(lang)/[lang]/ai/services/api';
import { useDownloadModelMutation } from '@/app/(lang)/[lang]/ai/services/api';
import LazyGlb from '@/components/GlbViewer';

function slugify(s?: string) {
  const base = (s || '').toLowerCase();
  return base
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80) || 'model';
}

export default function MarketplacePage() {
  const params = useParams<{ lang: string }>();
  const lang = (params?.lang || 'en') as string;
  const { data: session } = useSession();
  const isAuthed = !!(session as any)?.user?.id;

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<'recent' | 'likes' | 'comments'>('recent');

  const { data, isLoading } = useGetMarketplaceModelsQuery({ page, sort });
  const items = data?.items || [];

  const [likeModel] = useLikeModelMutation();
  const [unlikeModel] = useUnlikeModelMutation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">3D Model Marketplace</h1>
          <p className="text-lg text-gray-600">Discover amazing 3D models created by our community</p>
        </div>

        <div className="mb-8 flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setPage(1);
                setSort('likes');
              }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                sort === 'likes'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <Heart className="w-4 h-4" />
              </div>
              Most Liked
            </button>
            <button
              onClick={() => {
                setPage(1);
                setSort('comments');
              }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                sort === 'comments'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <MessageCircle className="w-4 h-4" />
              </div>
              Most Discussed
            </button>
            <button
              onClick={() => {
                setPage(1);
                setSort('recent');
              }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                sort === 'recent'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              Most Recent
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
          {isLoading ? (
            <div>Loading…</div>
          ) : !items.length ? (
            <div className="text-sm text-gray-500">No models yet.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((m: any) => (
                <Card
                  key={m.id}
                  lang={lang}
                  item={m}
                  canInteract={isAuthed}
                  onLikeToggle={async (id: string, liked: boolean) => {
                    try {
                      if (liked) await unlikeModel({ modelId: id }).unwrap();
                      else await likeModel({ modelId: id }).unwrap();
                    } catch {}
                  }}
                />
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!data || page <= 1}
              className="px-4 py-2 text-sm rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Prev
            </button>
            <div className="text-sm text-gray-500">Page {page}</div>
            <button
              onClick={() => setPage((p) => (data?.hasMore ? p + 1 : p))}
              disabled={!data?.hasMore}
              className="px-4 py-2 text-sm rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ item, lang, canInteract, onLikeToggle }: { item: any; lang: string; canInteract: boolean; onLikeToggle: (id: string, liked: boolean) => Promise<void> }) {
  // Prints state
  const [openPrints, setOpenPrints] = useState(false);
  const { data: printsData, isFetching: loadingPrints, refetch: refetchPrints } = useGetModelPrintsQuery(
    { modelId: item.id, page: 1, limit: 10 },
    { skip: !openPrints }
  );
  const [addPrint, { isLoading: addingPrint }] = useAddModelPrintMutation();
  const [presignUpload] = usePresignUploadMutation();
  const fileRef = useRef<HTMLInputElement>(null);
  const [printText, setPrintText] = useState('');

  // Local engagement state for instant UI feedback
  const [liked, setLiked] = useState<boolean>(!!item.userLiked);
  const [likesCount, setLikesCount] = useState<number>(Number(item.likesCount || 0));
  const [commentsCount, setCommentsCount] = useState<number>(Number(item.commentsCount || 0));
  const { data: likesData } = useGetModelLikesQuery({ modelId: item.id });
  React.useEffect(() => {
    if (likesData && typeof likesData.count === 'number') {
      setLikesCount(likesData.count);
      setLiked(!!likesData.userLiked);
    }
  }, [likesData]);

  // 3D viewer modal state
  const [showViewer, setShowViewer] = useState(false);

  const modelUrl = item?.modelUrls?.glb || item?.modelUrls?.fbx || item?.modelUrls?.obj || item?.modelUrls?.usdz || '';
  const [downloadModel] = useDownloadModelMutation();

  const projectLink = `/${lang}/ai/projects/${slugify(item.projectName || item.owner?.name || 'project')}/${encodeURIComponent(item.projectId)}`;

  // Routing for auth redirects
  const pathname = usePathname();
  const router = useRouter();

  async function handleLikeClick() {
    if (!canInteract) {
      const redirect = encodeURIComponent(pathname || `/${lang}/marketplace`);
      router.push(`/${lang}/auth/login?redirect=${redirect}`);
      return;
    }
    const nextLiked = !liked;
    // Optimistic update
    setLiked(nextLiked);
    setLikesCount((c) => c + (nextLiked ? 1 : -1));
    try {
      await onLikeToggle(item.id, liked);
    } catch (e) {
      // Revert on failure
      setLiked(!nextLiked);
      setLikesCount((c) => c + (nextLiked ? -1 : 1));
    }
  }

  async function handleDownload() {
    // Downloads are gated via credits and deliver OBJ
    if (!canInteract) {
      const redirect = encodeURIComponent(pathname || `/${lang}/marketplace`);
      router.push(`/${lang}/auth/login?redirect=${redirect}`);
      return;
    }
    // Check entitlement: if already owned, skip confirmation
    try {
      const resp = await fetch(`/api/marketplace/models/${encodeURIComponent(item.id)}/entitlement`, { cache: 'no-store' });
      if (resp.status === 401) {
        const redirect = encodeURIComponent(pathname || `/${lang}/marketplace`);
        router.push(`/${lang}/auth/login?redirect=${redirect}`);
        return;
      }
      const ej = await resp.json().catch(() => ({ owned: false }));
      const owned = !!ej?.owned;
      if (!owned) {
        const ok = window.confirm('This is gonna cost you 750 DC, do you want to download?');
        if (!ok) return;
      }
      const res = await downloadModel({ modelId: item.id }).unwrap();
      const url = (res as any)?.url;
      if (url) {
        window.open(url, '_blank');
      }
    } catch (e: any) {
      const status = e?.status || e?.originalStatus;
      if (status === 401) {
        const redirect = encodeURIComponent(pathname || `/${lang}/marketplace`);
        router.push(`/${lang}/auth/login?redirect=${redirect}`);
        return;
      }
      if (status === 402) {
        const go = window.confirm('You have insufficient credits to download this model. Buy credits now?');
        if (go) router.push(`/${lang}/credits`);
        return;
      }
      if (status === 404) {
        window.alert('OBJ file is not available for this model yet.');
        return;
      }
      window.alert('Download failed. Please try again later.');
    }
  }

  async function handleSendComment() {
    const content = text.trim();
    if (!canInteract) {
      const redirect = encodeURIComponent(pathname || `/${lang}/marketplace`);
      router.push(`/${lang}/auth/login?redirect=${redirect}`);
      return;
    }
    // Prepare attachments (optional)
    const files = commentFileRef.current?.files;
    const uploads: Array<{ url: string; mime?: string }> = [];
    try {
      if (files && files.length) {
        const max = Math.min(files.length, 10);
        for (let i = 0; i < max; i++) {
          const f = files[i];
          const type = f.type || 'application/octet-stream';
          const presigned = await presignUpload({ file: f }).unwrap();
          const finalUrl = (presigned as any).url || (presigned as any).publicUrl || (presigned as any).key || '';
          if (!finalUrl) continue;
          uploads.push({ url: finalUrl, mime: type });
        }
      }

      // Require some content or at least one attachment
      if (!content && uploads.length === 0) return;

      await addComment({ modelId: item.id, content: content || undefined, media: uploads }).unwrap();
      setText('');
      if (commentFileRef.current) commentFileRef.current.value = '';
      setCommentsCount((c) => c + 1);
      // Refresh comment list
      if (openComments) await refetchComments();
    } catch {}
  }

  async function handleSubmitPrint() {
    if (!canInteract) {
      const redirect = encodeURIComponent(pathname || `/${lang}/marketplace`);
      router.push(`/${lang}/auth/login?redirect=${redirect}`);
      return;
    }
    const desc = printText.trim();
    const files = fileRef.current?.files;
    const uploads: Array<{ url: string; mime?: string }> = [];
    try {
      if (files && files.length) {
        const max = Math.min(files.length, 10);
        for (let i = 0; i < max; i++) {
          const f = files[i];
          const type = f.type || 'application/octet-stream';
          const presigned = await presignUpload({ file: f }).unwrap();
          const finalUrl = (presigned as any).url || (presigned as any).publicUrl || (presigned as any).key || '';
          if (!finalUrl) continue;
          uploads.push({ url: finalUrl, mime: type });
        }
      }
      if (!uploads.length && !desc) return;
      await addPrint({ modelId: item.id, text: desc || undefined, media: uploads }).unwrap();
      setPrintText('');
      if (fileRef.current) fileRef.current.value = '';
      if (openPrints) await refetchPrints();
    } catch (e) {
      // noop: keep inputs so user can retry
    }
  }

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer" onClick={() => router.push(projectLink)} role="button">
      {/* Thumb opens 3D viewer modal */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); if (modelUrl) setShowViewer(true); }}
        className="w-full aspect-square relative overflow-hidden bg-gray-50"
        title={modelUrl ? 'Preview 3D' : 'No preview available'}
      >
        {item.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.thumbnailUrl} alt={item.prompt || 'model'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">No preview</div>
        )}
        {modelUrl ? (
          <span className="absolute bottom-2 right-2 text-xs px-2 py-1 rounded-md bg-black/70 text-white opacity-90">Preview</span>
        ) : null}
      </button>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {item.projectName || item.prompt || '3D Model'}
        </h3>

        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
            {(item.owner?.name || 'U').charAt(0)}
          </div>
          <span className="text-sm text-gray-600">{item.owner?.name || 'User'}</span>
        </div>

        {/* Engagement */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); handleLikeClick(); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              liked ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
            title={canInteract ? 'Like' : 'Sign in to like'}
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
            </div>
            <span className="text-sm font-medium">{likesCount}</span>
          </button>
          <Link
            href={`${projectLink}?modelId=${encodeURIComponent(item.id)}#comments`}
            onClick={(e) => { e.stopPropagation(); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-all whitespace-nowrap"
            title="Comments"
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">{commentsCount}</span>
          </Link>
        </div>


        {openPrints && (
          <div className="mt-2 border-t pt-2 space-y-2">
            {loadingPrints ? (
              <div className="text-xs text-gray-500">Loading prints…</div>
            ) : !printsData?.items?.length ? (
              <div className="text-xs text-gray-500">No prints yet. Be the first to share your printed result!</div>
            ) : (
              <div className="space-y-3 max-h-60 overflow-auto pr-1">
                {printsData.items.map((p: any) => (
                  <div key={p.id} className="text-sm">
                    <div className="text-[11px] text-gray-500 mb-1">{p.user?.name || 'User'} • {new Date(p.createdAt).toLocaleString()}</div>
                    {p.text ? <div className="mb-1 whitespace-pre-wrap">{p.text}</div> : null}
                    {Array.isArray(p.media) && p.media.length ? (
                      <div className="flex flex-wrap gap-2">
                        {p.media.map((m: any) => (
                          m.kind === 'image' ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img key={m.id} src={m.url} alt={m.id} className="h-24 w-auto object-cover rounded border" />
                          ) : m.kind === 'video' ? (
                            <video key={m.id} src={m.url} className="h-24 rounded border" controls />
                          ) : (
                            <a key={m.id} href={m.url} target="_blank" rel="noreferrer" className="px-2 py-1 text-xs rounded border hover:bg-gray-50">Download file</a>
                          )
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="file"
                ref={fileRef}
                multiple
                accept="image/*,video/*,.stl,.obj,.3mf,.gcode,.glb,.fbx,.usdz"
                className="flex-1 border rounded-md px-2 py-1 text-sm"
                disabled={!canInteract || addingPrint}
              />
              <input
                className="flex-1 border rounded-md px-2 py-1 text-sm"
                placeholder={canInteract ? 'Describe your print (optional)…' : 'Sign in to share a print'}
                value={printText}
                onChange={(e) => setPrintText(e.target.value)}
                disabled={!canInteract || addingPrint}
              />
              <button
                onClick={handleSubmitPrint}
                disabled={!canInteract || addingPrint}
                className="px-2 py-1 text-sm rounded-md border bg-black text-white disabled:opacity-50"
              >
                {addingPrint ? 'Posting…' : 'Post Print'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3D Viewer Modal */}
      {showViewer && modelUrl && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowViewer(false)}>
          <div className="bg-white rounded-xl w-full max-w-4xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-2 border-b">
              <div className="text-sm font-medium truncate pr-2">{item.prompt || '3D Model'}</div>
              <button type="button" className="text-sm px-2 py-1 rounded-md border hover:bg-gray-50" onClick={() => setShowViewer(false)}>Close</button>
            </div>
            <div className="aspect-video bg-gray-50">
              {/* Lazy load GLB/FBX/OBJ via viewer */}
              <LazyGlb modelUrl={modelUrl} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
