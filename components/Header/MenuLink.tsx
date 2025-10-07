// app/(lang)[lang]/_components/MenuLink.tsx
'use client';

import Link from 'next/link';
import type { ComponentProps } from 'react';

export default function MenuLink(props: ComponentProps<typeof Link>) {
    return (
        <Link
            {...props}
            onClick={(e) => {
                // Close the <details> dropdown so the menu collapses immediately
                const details = (e.currentTarget.closest('details') as HTMLDetailsElement | null);
                if (details) details.open = false;
                props.onClick?.(e);
            }}
        />
    );
}
