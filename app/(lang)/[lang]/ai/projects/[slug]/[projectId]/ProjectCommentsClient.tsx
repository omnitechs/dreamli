"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { MessageCircle, Send, Paperclip, X, FileText, Pencil, Trash2, Check, X as XIcon } from "lucide-react";
import {
  useGetModelCommentsQuery,
  useAddModelCommentMutation,
  usePresignUploadMutation,
  useUpdateModelCommentMutation,
  useDeleteModelCommentMutation,
} from "@/app/(lang)/[lang]/ai/services/api";

type ModelLite = {
  id: string;
  prompt?: string | null;
  createdAt?: string | Date | null;
};

export default function ProjectCommentsClient({ models }: { models: ModelLite[] }) {
  const { data: session } = useSession();
  const isAuthed = !!(session as any)?.user?.id;
  const userId = (session as any)?.user?.id as string | undefined;
  const params = useParams<{ lang: string }>();
  const lang = (params?.lang || "en") as string;

  const router = useRouter();
  const pathname = usePathname();

  const sortedModels = useMemo(() => {
    return [...models].sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }, [models]);

  const searchParams = useSearchParams();
  const modelIdFromQuery = searchParams.get('modelId');

  const [activeId, setActiveId] = useState<string>(sortedModels[0]?.id || "");

  // On mount or when models change, prefer modelId from query if valid
  useEffect(() => {
    if (modelIdFromQuery) {
      const exists = sortedModels.some(m => m.id === modelIdFromQuery);
      if (exists) setActiveId(modelIdFromQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelIdFromQuery, sortedModels.map(m => m.id).join('|')]);

  const { data, isFetching, refetch } = useGetModelCommentsQuery(
    { modelId: activeId, page: 1, limit: 20 },
    { skip: !activeId }
  );

  const [addComment, { isLoading: posting }] = useAddModelCommentMutation();
  const [presignUpload] = usePresignUploadMutation();

  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState<Array<{ file: File; url: string; name: string; type: 'image' | 'file' }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit/Delete state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>("");

  const [updateComment, { isLoading: updating }] = useUpdateModelCommentMutation();
  const [deleteComment, { isLoading: deleting }] = useDeleteModelCommentMutation();

  // Flatten all image media from current comments for modal navigation
  const images = useMemo(() => {
    const list: Array<{ url: string; id: string; name?: string }> = [];
    const items: any[] = Array.isArray((data as any)?.items) ? (data as any).items : [];
    for (const c of items) {
      const media = Array.isArray(c?.media) ? c.media : [];
      for (const m of media) {
        if (m && m.kind === 'image' && m.url) {
          list.push({ url: String(m.url), id: String(m.id || m.url), name: m.name });
        }
      }
    }
    return list;
  }, [data]);
  const urlToIndex = useMemo(() => {
    const map = new Map<string, number>();
    images.forEach((im, idx) => map.set(im.url, idx));
    return map;
  }, [images]);

  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const current = openIdx != null ? images[openIdx] : null;

  function onDownload(url: string) {
    try {
      const a = document.createElement('a');
      a.href = url;
      const name = url.split('?')[0].split('#')[0].split('/').pop() || 'file';
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      window.open(url, '_blank');
    }
  }

  useEffect(() => {
    if (openIdx == null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpenIdx(null);
      } else if (e.key === 'ArrowLeft') {
        setOpenIdx((idx) => {
          if (idx == null || images.length === 0) return idx;
          return (idx - 1 + images.length) % images.length;
        });
      } else if (e.key === 'ArrowRight') {
        setOpenIdx((idx) => {
          if (idx == null || images.length === 0) return idx;
          return (idx + 1) % images.length;
        });
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openIdx, images.length]);

  function handleAddAttachment(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    const list: Array<{ file: File; url: string; name: string; type: 'image' | 'file' }> = [];
    for (const f of Array.from(files)) {
      const url = URL.createObjectURL(f);
      const type: 'image' | 'file' = f.type.startsWith('image/') ? 'image' : 'file';
      list.push({ file: f, url, name: f.name, type });
    }
    setAttachments((prev) => [...prev, ...list]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function handleRemoveAttachment(index: number) {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  }

  async function onSend() {
    if (!activeId) return;
    if (!isAuthed) {
      const redirect = encodeURIComponent(pathname || `/${lang}/ai`);
      router.push(`/${lang}/auth/login?redirect=${redirect}`);
      return;
    }

    const content = text.trim();
    const uploads: Array<{ url: string; mime?: string }> = [];

    try {
      if (attachments.length) {
        const max = Math.min(attachments.length, 10);
        for (let i = 0; i < max; i++) {
          const a = attachments[i];
          const type = a.file.type || 'application/octet-stream';
          const presigned = await presignUpload({ file: a.file }).unwrap();
          const finalUrl = (presigned as any).url || (presigned as any).publicUrl || (presigned as any).key || '';
          if (!finalUrl) continue;
          uploads.push({ url: finalUrl, mime: type });
        }
      }

      if (!content && uploads.length === 0) return;

      await addComment({ modelId: activeId, content: content || undefined, media: uploads }).unwrap();
      setText("");
      setAttachments([]);
      await refetch();
    } catch (e) {
      // no-op; keep input for retry
    }
  }

  return (
    <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200" id="comments">
      <div className="flex items-center gap-3 mb-6">
        <MessageCircle className="w-6 h-6 text-gray-700" />
        <h2 className="text-2xl font-bold text-gray-900">Comments ({data?.total ?? 0})</h2>
      </div>

      {/* Comment Composer */}
      <div className="mb-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={isAuthed ? 'Share your thoughts...' : 'Sign in to comment'}
          maxLength={500}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={3}
          disabled={!isAuthed || posting}
        />
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap">
              <Paperclip className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">Attach</span>
              <input
                type="file"
                multiple
                onChange={handleAddAttachment}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx"
                ref={fileInputRef}
                disabled={!isAuthed || posting}
              />
            </label>
            <span className="text-xs text-gray-500">{text.length}/500</span>
          </div>
          <button
            onClick={onSend}
            disabled={!isAuthed || posting || (!text.trim() && attachments.length === 0)}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors whitespace-nowrap cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Post</span>
          </button>
        </div>

        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-4">
            {attachments.map((a, index) => (
              <div key={index} className="relative group bg-white rounded-lg p-2 border border-gray-200">
                {a.type === 'image' ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.url} alt={a.name} className="w-20 h-20 object-cover rounded" />
                ) : (
                  <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded">
                    <FileText className="w-8 h-8 text-gray-600" />
                  </div>
                )}
                <button
                  onClick={() => handleRemoveAttachment(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {isFetching ? (
          <div className="text-sm text-gray-500">Loading comments…</div>
        ) : !data?.items?.length ? (
          <div className="text-sm text-gray-500">No comments yet. Be the first to share your thoughts.</div>
        ) : (
          data.items.map((comment: any) => (
            <div key={comment.id} className="flex gap-4">
              <Link href={`/${lang}/profile/${encodeURIComponent((comment.user as any)?.username || (comment.user as any)?.id || '')}`} className="flex-shrink-0" prefetch={false}>
                {comment.user?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={comment.user.image} alt={comment.user?.name || 'User'} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-lg font-semibold">
                    {(comment.user?.name || 'U').charAt(0)}
                  </div>
                )}
              </Link>
              <div className="flex-1">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 truncate">
                      <Link href={`/${lang}/profile/${encodeURIComponent((comment.user as any)?.username || (comment.user as any)?.id || '')}`} className="hover:underline" prefetch={false}>
                        {comment.user?.name || 'User'}
                      </Link>
                    </h4>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
                      {userId && ((comment.userId || (comment.user && comment.user.id)) === userId) ? (
                        editingId === comment.id ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={async () => {
                                try {
                                  await updateComment({ modelId: activeId, commentId: comment.id, content: editingText }).unwrap();
                                  setEditingId(null);
                                  setEditingText("");
                                  await refetch();
                                } catch {}
                              }}
                              disabled={updating}
                              className="p-1 rounded-md border bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                              title="Save"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => { setEditingId(null); setEditingText(""); }}
                              className="p-1 rounded-md border hover:bg-gray-100"
                              title="Cancel"
                            >
                              <XIcon className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => { setEditingId(comment.id); setEditingText(comment.content || ""); }}
                              className="p-1 rounded-md border hover:bg-gray-100"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={async () => {
                                if (!confirm("Delete this comment?")) return;
                                try { await deleteComment({ modelId: activeId, commentId: comment.id }).unwrap(); await refetch(); } catch {}
                              }}
                              disabled={deleting}
                              className="p-1 rounded-md border hover:bg-red-50 text-red-600 disabled:opacity-50"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )
                      ) : null}
                    </div>
                  </div>
                  {editingId === comment.id ? (
                    <textarea
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      maxLength={500}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      rows={3}
                    />
                  ) : comment.content ? (
                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                  ) : null}

                  {Array.isArray(comment.media) && comment.media.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-4">
                      {comment.media.map((m: any) => (
                        <div key={m.id} className="rounded-lg overflow-hidden border border-gray-200">
                          {m.kind === 'image' ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={m.url}
                              alt={m.id}
                              className="w-48 h-32 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => {
                                const idx = urlToIndex.get(String(m.url));
                                if (typeof idx === 'number') setOpenIdx(idx);
                              }}
                            />
                          ) : m.kind === 'video' ? (
                            <video src={m.url} className="w-48 h-32 object-cover" controls />
                          ) : (
                            <a
                              href={m.url}
                              download={(m.name || 'attachment') as string}
                              target="_blank"
                              rel="noreferrer"
                              className="w-48 h-32 bg-gray-100 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-200 transition-colors block"
                              title={m.name || 'Download attachment'}
                            >
                              <FileText className="w-8 h-8 text-gray-600 mx-auto" />
                              <span className="text-xs text-gray-600 px-2 text-center truncate w-full">{m.name || 'Attachment'}</span>
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Image Modal for comment attachments */}
      {current ? (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setOpenIdx(null)}>
          <div className="bg-white rounded-2xl w-full max-w-5xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="text-sm font-medium truncate">{current.name || current.id}</div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 text-sm rounded-md border bg-white hover:bg-gray-50" onClick={() => window.open(current.url, '_blank')}>Open in new tab</button>
                <button className="px-3 py-1.5 text-sm rounded-md border bg-blue-600 text-white hover:bg-blue-700" onClick={() => onDownload(current.url)}>Download</button>
                <button className="px-3 py-1.5 text-sm rounded-md border" onClick={() => setOpenIdx(null)}>Close</button>
              </div>
            </div>
            <div className="relative max-h-[80vh] bg-gray-50">
              <button
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 hover:bg-white border shadow"
                onClick={() => setOpenIdx((idx) => (idx == null || images.length === 0 ? idx : (idx - 1 + images.length) % images.length))}
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 hover:bg-white border shadow"
                onClick={() => setOpenIdx((idx) => (idx == null || images.length === 0 ? idx : (idx + 1) % images.length))}
                aria-label="Next image"
              >
                ›
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={current.url} alt={current.id} className="w-full h-auto object-contain max-h-[80vh]" />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
