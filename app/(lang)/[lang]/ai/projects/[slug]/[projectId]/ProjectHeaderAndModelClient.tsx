"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import ProjectHeaderActionsClient from "./ProjectHeaderActionsClient";
import ProjectModelSectionClient, { type ModelForViewer } from "./ProjectModelSectionClient";
import { useTranslations } from "next-intl";

export type OwnerInfo = { id: string; name?: string | null; image?: string | null; username?: string | null } | null;

export default function ProjectHeaderAndModelClient({ projectName, owner, models }: { projectName: string; owner: OwnerInfo; models: ModelForViewer[]; }) {
  const defaultModelId = useMemo(() => models?.[0]?.id || "", [models]);
  const [selectedModelId, setSelectedModelId] = useState<string>(defaultModelId);
  const params = useParams<{ lang: string }>();
  const lang = (params?.lang || "en") as string;
  const t = useTranslations("Marketplace");
  const ownerHref = owner ? `/${lang}/profile/${encodeURIComponent(owner.username || owner.id)}` : "#";

  // Ensure state follows models changes
  React.useEffect(() => {
    if (!selectedModelId && defaultModelId) setSelectedModelId(defaultModelId);
  }, [defaultModelId, selectedModelId]);

  return (
    <>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              {owner ? (
                <Link href={ownerHref} className="flex-shrink-0" prefetch={false}>
                  {owner.image ? (
                    <Image src={owner.image} alt={owner.name || "User"} width={48} height={48} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-lg font-semibold">
                      {(owner.name || "U").charAt(0)}
                    </div>
                  )}
                </Link>
              ) : (
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-lg font-semibold">U</div>
              )}
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{projectName}</h1>
                <p className="text-xs sm:text-sm text-gray-600">
                  {owner ? (
                    <>by <Link href={ownerHref} className="hover:underline" prefetch={false}>{owner.name || "User"}</Link></>
                  ) : null}
                </p>
              </div>
            </div>
            <div className="-mx-2 px-2 overflow-x-auto sm:overflow-visible flex items-center gap-3">
              <ProjectHeaderActionsClient modelId={selectedModelId || null} />
              <Link
                href={`/${lang}/ai`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-colors"
                prefetch={false}
              >
                {t("cta.createYourOwn")}
              </Link>
            </div>
          </div>
        </div>
      </div>


      {/* 3D Model Section (controlled selection) */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <ProjectModelSectionClient
          models={models}
          activeId={selectedModelId}
          onActiveChange={(id) => setSelectedModelId(id)}
        />
      </div>
    </>
  );
}
