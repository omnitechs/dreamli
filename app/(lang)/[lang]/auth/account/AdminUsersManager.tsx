"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/app/store";
import { fetchUsers, addUserCredits, deductUserCredits } from "@/app/store/slices/adminUsersSlice";
import { adjustMyCredits } from "@/app/store/slices/accountUserSlice";

type UserRow = {
    id: string;
    name: string | null;
    email: string | null;
    role: string;
    creditsBalance: string; // Decimal serialized
    createdAt: string;
};

export default function AdminUsersManager() {
    const dispatch = useDispatch<AppDispatch>();
    const users = useSelector((s: RootState) => s.adminUsers.items);
    const status = useSelector((s: RootState) => s.adminUsers.status);
    const error = useSelector((s: RootState) => s.adminUsers.error);
    const myId = useSelector((s: RootState) => s.accountUser.me?.id);

    const busy = useMemo(() => status === 'loading', [status]);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchUsers());
        }
    }, [dispatch, status]);

    async function onAdjust(userId: string, deltaStr: string, reason: string) {
        const amount = Number(deltaStr);
        if (!Number.isFinite(amount) || amount <= 0) {
            alert("Enter a positive amount");
            return;
        }
        const isAdd = reason.toLowerCase().startsWith("add:") || reason.toLowerCase().startsWith("bonus") || deltaStr.startsWith("+");
        if (isAdd) {
            try {
                if (myId && myId === userId) dispatch(adjustMyCredits({ userId, delta: amount }));
                await dispatch(addUserCredits({ userId, amount, reason })).unwrap();
            } catch (e: any) {
                if (myId && myId === userId) dispatch(adjustMyCredits({ userId, delta: -amount }));
                alert(e?.message ?? 'Operation failed');
            }
        } else {
            try {
                if (myId && myId === userId) dispatch(adjustMyCredits({ userId, delta: -amount }));
                await dispatch(deductUserCredits({ userId, amount, reason })).unwrap();
            } catch (e: any) {
                if (myId && myId === userId) dispatch(adjustMyCredits({ userId, delta: amount }));
                alert(e?.message ?? 'Operation failed');
            }
        }
    }

    if (status === 'loading' || status === 'idle') return <div>Loading users…</div>;
    if (error) return <div className="text-red-600">{error}</div>;

    return (
        <div className="mt-8">
            <h2 className="text-xl font-semibold mb-3">All users</h2>
            <div className="overflow-x-auto border rounded">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Email</th>
                        <th className="text-left p-2">Role</th>
                        <th className="text-right p-2">Credits</th>
                        <th className="text-left p-2">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map(u => (
                        <tr key={u.id} className="border-t">
                            <td className="p-2">{u.name ?? "—"}</td>
                            <td className="p-2">{u.email ?? "—"}</td>
                            <td className="p-2 uppercase">{u.role}</td>
                            <td className="p-2 text-right">{u.creditsBalance}</td>
                            <td className="p-2">
                                <InlineAdjust onSubmit={(amount, reason, type) => onAdjust(u.id, amount, `${type}: ${reason}`)} disabled={busy} />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function InlineAdjust({ onSubmit, disabled }: { onSubmit: (amount: string, reason: string, type: "Add" | "Deduct") => void; disabled?: boolean }) {
    const [amount, setAmount] = useState("");
    const [reason, setReason] = useState("");
    const [type, setType] = useState<"Add" | "Deduct">("Add");

    return (
        <form className="flex items-center gap-2" onSubmit={(e) => { e.preventDefault(); onSubmit(amount.trim(), reason.trim() || (type === "Add" ? "Add" : "Deduct"), type); setAmount(""); setReason(""); }}>
            <select className="border rounded px-2 py-1" value={type} onChange={(e) => setType(e.target.value as any)} disabled={disabled}>
                <option value="Add">Add</option>
                <option value="Deduct">Deduct</option>
            </select>
            <input className="border rounded px-2 py-1 w-24" placeholder="Amount" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} disabled={disabled} />
            <input className="border rounded px-2 py-1 w-56" placeholder="Reason" value={reason} onChange={(e) => setReason(e.target.value)} disabled={disabled} />
            <button className="px-3 py-1 border rounded" disabled={disabled}>Apply</button>
        </form>
    );
}
