"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function SettingsRedirectPage() {
  const params = useParams<{ lang: string }>();
  const lang = (params?.lang || 'en') as string;
  const router = useRouter();

  useEffect(() => {
    router.replace(`/${lang}/profile`);
  }, [lang, router]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Profile</h1>
      <p className="text-sm text-gray-600">Redirecting to your profile…</p>
    </div>
  );
}
