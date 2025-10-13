// app/layout.tsx
import { ReduxProvider } from './provider';

import React from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <ReduxProvider>
            {children}
        </ReduxProvider>
    );
}
