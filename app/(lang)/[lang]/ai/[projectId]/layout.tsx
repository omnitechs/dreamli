// app/layout.tsx

import React from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="fixed inset-x-0 bottom-0 top-14 md:top-16 overflow-hidden">
            {children}
        </div>
    );
}
