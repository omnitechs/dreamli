// lib/auth.ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { addCredits } from "@/lib/credits";
import { SIGNUP_BONUS_DC } from "@/lib/currency";
import { subscribeToMailchimpAudience, splitName } from "@/lib/mailchimp";

const credentialsSchema = z.object({
    email: z.email(),
    password: z.string().min(1),
});

export const {
    auth,
    signIn,
    signOut,
    handlers: { GET, POST },
} = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" }, // ✅ use JWT sessions
    allowDangerousEmailAccountLinking: true,
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        Credentials({
            name: "Email & Password",
            credentials: { email: {}, password: {} },
            async authorize(raw) {
                const parsed = credentialsSchema.safeParse(raw);
                if (!parsed.success) return null;

                const email = parsed.data.email.trim().toLowerCase();
                const password = parsed.data.password;

                const user = await prisma.user.findUnique({ where: { email } });
                if (!user || !user.passwordHash) return null;

                const ok = await bcrypt.compare(password, user.passwordHash);
                if (!ok) return null;

                // Return minimal fields you want baked into the JWT
                return { id: user.id, email: user.email, name: user.name, role: user.role };
            },
        }),
    ],
    callbacks: {
        // Runs at sign-in and whenever the session is checked.
        async jwt({ token, user }) {
            // On first sign-in, "user" is defined → copy fields to the token
            if (user) {
                token.id = (user as any).id;
                token.role = (user as any).role ?? "user";
                token.name = user.name ?? token.name;
                token.email = user.email ?? token.email;
            }
            return token;
        },

        // Client-visible session shape (use token values here in JWT mode)
        async session({ session, token /* user is undefined in JWT mode */ }) {
            if (session.user) {
                (session.user as any).id = token.id as string | undefined;
                (session.user as any).role = (token as any).role ?? "user";
            }
            return session;
        },
    },
    events: {
        // Award signup bonus for first-time OAuth/social signups (and adapter-created users)
        async createUser({ user }) {
            try {
                if (!user?.id) return;
                await addCredits({
                    userId: user.id,
                    amount: SIGNUP_BONUS_DC,
                    reason: "signup_bonus",
                    idempotencyKey: `signup_bonus:${user.id}`,
                    reference: "oauth",
                });
            } catch (e) {
                console.error("Failed to award signup bonus on createUser", e);
            }

            // Subscribe first-time users to Mailchimp audience (no-op if not configured)
            try {
                const email = user?.email ?? undefined;
                if (email) {
                    const { firstName, lastName } = splitName(user?.name ?? null);
                    await subscribeToMailchimpAudience({
                        email,
                        firstName,
                        lastName,
                        tags: ["oauth"],
                    });
                }
            } catch (e) {
                console.error("Failed to subscribe user to Mailchimp on createUser", e);
            }
        },
    },
    // optional: debug in dev
    // debug: process.env.NODE_ENV !== "production",
});
