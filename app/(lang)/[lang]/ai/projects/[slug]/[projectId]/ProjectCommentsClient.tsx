"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  useGetModelCommentsQuery,
  useAddModelCommentMutation,
  usePresignUploadMutation,
} from "@/app/(lang)/[lang]/ai/services/api";

type ModelLite = {
  id: string;
  prompt?: string | null;
  createdAt?: string | Date | null;
};

export default function ProjectCommentsClient({ models }: { models: ModelLite[] }) {
  const { data: session } = useSession();
  const isAuthed = !!(session as any)?.user?.id;
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
  const fileRef = useRef<HTMLInputElement>(null);

  async function onSend() {
    if (!activeId) return;
    if (!isAuthed) {
      const redirect = encodeURIComponent(pathname || `/${lang}/ai`);
      router.push(`/${lang}/auth/login?redirect=${redirect}`);
      return;
    }

    const content = text.trim();
    const files = fileRef.current?.files;
    const uploads: Array<{ url: string; mime?: string }> = [];

    try {
      if (files && files.length) {
        const max = Math.min(files.length, 10);
        for (let i = 0; i < max; i++) {
          const f = files[i];
          const type = f.type || "application/octet-stream";
          const presigned = await presignUpload({ file: f }).unwrap();
          const finalUrl = (presigned as any).url || (presigned as any).publicUrl || (presigned as any).key || "";
          if (!finalUrl) continue;
          uploads.push({ url: finalUrl, mime: type });
        }
      }

      if (!content && uploads.length === 0) return;

      await addComment({ modelId: activeId, content: content || undefined, media: uploads }).unwrap();
      setText("");
      if (fileRef.current) fileRef.current.value = "";
      await refetch();
    } catch (e) {
      // no-op; keep input for retry
    }
  }

  return (
    <div className="bg-white border rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-base font-medium">Comments</div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Model</label>
          <select
            value={activeId}
            onChange={(e) => setActiveId(e.target.value)}
            className="border rounded-md px-2 py-1 text-sm min-w-[220px]"
          >
            {sortedModels.map((m) => (
              <option key={m.id} value={m.id}>
                {(m.prompt && m.prompt.length > 60 ? m.prompt.slice(0, 57) + "…" : (m.prompt || "Model"))}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {isFetching ? (
          <div className="text-sm text-gray-500">Loading comments…</div>
        ) : !data?.items?.length ? (
          <div className="text-sm text-gray-500">No comments yet. Be the first to share your thoughts.</div>
        ) : (
          <div className="space-y-3 max-h-[28rem] overflow-auto pr-1">
            {data.items.map((c: any) => (
              <div key={c.id} className="border rounded-lg p-3">
                <div className="flex items-center gap-2 text-[11px] text-gray-500 mb-1">
                  {c.user?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.user.image} alt="avatar" className="h-5 w-5 rounded-full border object-cover" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border bg-gray-100" />
                  )}
                  <div className="truncate">{c.user?.name || "User"}</div>
                  <div>•</div>
                  <div>{new Date(c.createdAt).toLocaleString()}</div>
                </div>
                {c.content ? <div className="text-sm whitespace-pre-wrap">{c.content}</div> : null}
                {Array.isArray(c.media) && c.media.length ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {c.media.map((m: any) => (
                      m.kind === 'image' ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img key={m.id} src={m.url} alt={m.id} className="h-24 w-auto rounded border object-cover" />
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

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
          <input
            className="flex-1 border rounded-md px-3 py-2 text-sm"
            placeholder={isAuthed ? "Write a comment…" : "Sign in to comment"}
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={!isAuthed || posting}
          />
          <input
            type="file"
            ref={fileRef}
            multiple
            accept="image/*,video/*,.stl,.obj,.3mf,.gcode,.glb,.fbx,.usdz"
            className="flex-1 border rounded-md px-3 py-2 text-sm"
            disabled={!isAuthed || posting}
          />
          <button
            onClick={onSend}
            disabled={!isAuthed || posting || (!text.trim() && !(fileRef.current && fileRef.current.files && fileRef.current.files.length))}
            className="px-3 py-2 text-sm rounded-md border bg-black text-white disabled:opacity-50"
          >
            {posting ? "Sending…" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
