// app/providers.tsx
"use client";
import { SessionProvider } from "next-auth/react";

// Centralized providers for the entire app.
// Configure SessionProvider to avoid excessive /api/auth/session polling.
export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider
            // Disable background polling to prevent frequent hits to /api/auth/session
            refetchInterval={0}
            refetchOnWindowFocus={false}
        >
            {children}
        </SessionProvider>
    );
}
