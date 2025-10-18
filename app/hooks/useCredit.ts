// hooks/useCredits.ts
import { useState, useCallback } from "react";
import { postJSON } from "@/lib/api";
import { v4 as uuid } from "uuid";

export function useAddCredits() {
    const [loading, setLoading] = useState(false);
    const run = useCallback(async (p: {
        userId: string; amount: number; reason: string; reference?: string;
        idempotencyKey?: string;
    }) => {
        setLoading(true);
        try {
            const key = p.idempotencyKey ?? uuid();
            const data = await postJSON<{ ok: boolean; entry: any }>(
                "/api/credits/add",
                { ...p, idempotencyKey: key }
            );
            return data.entry;
        } finally {
            setLoading(false);
        }
    }, []);
    return { addCredits: run, loading };
}

export function useDeductCredits() {
    const [loading, setLoading] = useState(false);
    const run = useCallback(async (p: {
        userId: string; amount: number; reason: string; reference?: string;
        idempotencyKey?: string;
    }) => {
        setLoading(true);
        try {
            const key = p.idempotencyKey ?? uuid();
            const data = await postJSON<{ ok: boolean; entry: any }>(
                "/api/credits/deduct",
                { ...p, idempotencyKey: key }
            );
            return data.entry;
        } finally {
            setLoading(false);
        }
    }, []);
    return { deductCredits: run, loading };
}
