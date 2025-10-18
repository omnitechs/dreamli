"use client";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/app/store';
import { hydrateMe } from '@/app/store/slices/accountUserSlice';

export type MeProp = {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  creditsBalance: string; // stringified Decimal
  createdAt: string; // ISO
} | null;

export default function AccountClient({ me }: { me: MeProp }) {
  const dispatch = useDispatch<AppDispatch>();
  const my = useSelector((s: RootState) => s.accountUser.me);

  useEffect(() => {
    dispatch(hydrateMe(me));
  }, [dispatch, me]);

  if (!my) return null;
  return (
    <>
      <div className="text-sm text-gray-600">Member since {new Date(my.createdAt).toLocaleDateString?.() ?? "—"}</div>
      <div>Signed in as <b>{my.email ?? "—"}</b> ({String(my.role)})</div>
      <div className="text-lg">Credits: <b>{String(my.creditsBalance ?? "0.00")}</b></div>
    </>
  );
}
