import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function PublicProfileRedirect({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  // Enforce multilingual routing: redirect to default "en" locale
  redirect(`/en/profile/${encodeURIComponent(username)}`);
}
