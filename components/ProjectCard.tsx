"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, MessageCircle, Eye } from "lucide-react";

export type ProjectCardProps = {
  href: string; // Project page URL
  title: string;
  imageUrl?: string | null;
  // Engagement
  likesCount?: number;
  commentsCount?: number;
  viewsCount?: number;
  likedByMe?: boolean;
  // Like toggle (optional). If provided, the heart becomes interactive.
  onToggleLike?: (nextLiked: boolean) => Promise<void> | void;
  // Optional extras
  subtitleNode?: React.ReactNode; // e.g., owner chip
  badgeText?: string; // e.g., "Private"
  metaText?: string; // small muted text under title (e.g., date)
  className?: string;
};

export default function ProjectCard({
  href,
  title,
  imageUrl,
  likesCount: likesCountProp = 0,
  commentsCount = 0,
  viewsCount = 0,
  likedByMe = false,
  onToggleLike,
  subtitleNode,
  badgeText,
  metaText,
  className,
}: ProjectCardProps) {
  const [liked, setLiked] = useState(!!likedByMe);
  const [likesCount, setLikesCount] = useState<number>(Number(likesCountProp || 0));
  const canLike = typeof onToggleLike === "function";

  // Keep local state in sync if parent updates likedByMe or likesCount
  useEffect(() => {
    setLiked(!!likedByMe);
  }, [likedByMe]);
  useEffect(() => {
    setLikesCount(Number(likesCountProp || 0));
  }, [likesCountProp]);

  async function handleLikeClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (!canLike) return;
    const next = !liked;
    setLiked(next);
    setLikesCount((c) => c + (next ? 1 : -1));
    try {
      await onToggleLike?.(next);
    } catch {
      // revert on error
      setLiked(!next);
      setLikesCount((c) => c + (next ? -1 : 1));
    }
  }

  return (
    <div className={
      [
        "group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100",
        className || "",
      ].join(" ")
    }>
      <Link href={href} className="block relative">
        <div className="w-full aspect-[3/2] sm:aspect-video relative overflow-hidden bg-gray-50">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">No preview</div>
          )}
          {badgeText ? (
            <div className="absolute top-2 right-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-[11px] font-medium rounded-full">
              {badgeText}
            </div>
          ) : null}
        </div>
      </Link>

      <div className="p-4">
        <Link href={href} className="block mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
        </Link>

        {subtitleNode ? (
          <div className="mb-2">{subtitleNode}</div>
        ) : null}

        {metaText ? (
          <div className="text-xs text-gray-500 mb-3">{metaText}</div>
        ) : null}

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={handleLikeClick}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              liked ? "bg-red-50 text-red-600" : canLike ? "bg-gray-50 text-gray-600 hover:bg-gray-100" : "bg-gray-50 text-gray-400 cursor-default"
            }`}
            title={canLike ? "Like" : "Likes"}
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
            </div>
            <span className="text-sm font-medium">{likesCount}</span>
          </button>

          <div className="flex items-center gap-4 text-gray-600">
            <div className="flex items-center gap-1.5 text-sm">
              <MessageCircle className="w-4 h-4" />
              <span>{commentsCount || 0}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <Eye className="w-4 h-4" />
              <span>{viewsCount || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
