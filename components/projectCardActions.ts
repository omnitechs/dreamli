/**
 * Centralized factory for like/unlike handler used by ProjectCard across pages.
 * Handles auth redirect consistently and calls the RTK query mutations.
 */
export function makeToggleLikeHandler(opts: {
  lang: string;
  pathname?: string | null;
  router: any;
  isAuthed: boolean;
  likeModel: (args: { modelId: string }) => Promise<any> | { unwrap?: () => Promise<any> } | any;
  unlikeModel: (args: { modelId: string }) => Promise<any> | { unwrap?: () => Promise<any> } | any;
  redirectFallbackPath?: string; // e.g., '/ai', '/marketplace', '/profile'
}) {
  const { lang, pathname, router, isAuthed, likeModel, unlikeModel, redirectFallbackPath } = opts;
  return (modelId: string) => async (nextLiked: boolean) => {
    if (!modelId) return;
    if (!isAuthed) {
      const fallback = redirectFallbackPath || '';
      const redirect = encodeURIComponent(pathname || `/${lang}${fallback}`);
      router.push(`/${lang}/auth/login?redirect=${redirect}`);
      throw new Error('auth');
    }
    try {
      const call = nextLiked ? likeModel : unlikeModel;
      const res = call({ modelId });
      if (res && typeof res.unwrap === 'function') {
        await res.unwrap();
      } else {
        await res;
      }
    } catch (e) {
      throw e as any;
    }
  };
}
