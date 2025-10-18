// app/api/credits/balance/route.ts
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { creditsBalance: true } });
  const balance = user?.creditsBalance ?? 0;
  return Response.json({ balance: typeof balance === 'number' ? balance : Number(balance) });
}
