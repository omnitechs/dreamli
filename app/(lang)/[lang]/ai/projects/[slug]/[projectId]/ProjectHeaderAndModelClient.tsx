"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import ProjectHeaderActionsClient from "./ProjectHeaderActionsClient";
import ProjectModelSectionClient, { type ModelForViewer } from "./ProjectModelSectionClient";

export type OwnerInfo = { id: string; name?: string | null; image?: string | null } | null;

export default function ProjectHeaderAndModelClient({ projectName, owner, models }: { projectName: string; owner: OwnerInfo; models: ModelForViewer[]; }) {
  const defaultModelId = useMemo(() => models?.[0]?.id || "", [models]);
  const [selectedModelId, setSelectedModelId] = useState<string>(defaultModelId);

  // Ensure state follows models changes
  React.useEffect(() => {
    if (!selectedModelId && defaultModelId) setSelectedModelId(defaultModelId);
  }, [defaultModelId, selectedModelId]);

  return (
    <>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {owner?.image ? (
                <Image src={owner.image} alt={owner.name || "User"} width={48} height={48} className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-lg font-semibold">
                  {(owner?.name || "U").charAt(0)}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{projectName}</h1>
                <p className="text-sm text-gray-600">{owner ? <>by {owner.name || "User"}</> : null}</p>
              </div>
            </div>
            <ProjectHeaderActionsClient modelId={selectedModelId || null} />
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
