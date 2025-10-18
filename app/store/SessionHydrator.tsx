"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import type { AppDispatch, RootState } from "./index";
import { hydrateMe } from "./slices/accountUserSlice";

/**
 * Keeps Redux accountUser slice in sync with NextAuth session globally.
 * Mounted once under ReduxProvider.
 */
export default function SessionHydrator() {
  const dispatch = useDispatch<AppDispatch>();
  const me = useSelector((s: RootState) => s.accountUser.me);
  const { data: session, status } = useSession();

  useEffect(() => {
    const user: any = session?.user;

    if (status === "authenticated" && user) {
      const id = (user.id as string) || (user.email as string) || "unknown";
      const payload = {
        id,
        name: (user.name as string) ?? null,
        email: (user.email as string) ?? null,
        role: (user.role as string) ?? "user",
        creditsBalance: me?.creditsBalance ?? "0.00",
        createdAt: me?.createdAt ?? new Date().toISOString(),
      } as const;
      (dispatch as AppDispatch)(hydrateMe(payload as any));
    }

    if (status === "unauthenticated" && me) {
      (dispatch as AppDispatch)(hydrateMe(null));
    }
  }, [status, session, dispatch]);

  return null;
}
