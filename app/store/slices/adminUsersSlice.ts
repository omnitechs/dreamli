import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';
import { adjustMyCredits } from './accountUserSlice';

export type AdminUserRow = {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  creditsBalance: string;
  createdAt: string;
};

export type AdminUsersState = {
  items: AdminUserRow[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
};

const initialState: AdminUsersState = {
  items: [],
  status: 'idle',
};

export const fetchUsers = createAsyncThunk<AdminUserRow[], void, { rejectValue: string }>(
  'adminUsers/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/admin/users', { cache: 'no-store' });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      return data.users as AdminUserRow[];
    } catch (e: any) {
      return rejectWithValue(e?.message ?? 'Failed to load users');
    }
  }
);

export const addUserCredits = createAsyncThunk<
  { userId: string; amount: number; idempotencyKey: string },
  { userId: string; amount: number; reason: string; reference?: string },
  { rejectValue: { message: string; userId: string; amount: number } }
>(
  'adminUsers/addUserCredits',
  async (p, { rejectWithValue }) => {
    const key = uuid();
    try {
      const res = await fetch('/api/credits/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...p, idempotencyKey: key }),
      });
      if (!res.ok) throw new Error(await res.text());
      await res.json();
      return { userId: p.userId, amount: p.amount, idempotencyKey: key };
    } catch (e: any) {
      return rejectWithValue({ message: e?.message ?? 'Add credits failed', userId: p.userId, amount: p.amount });
    }
  },
  {
    // Optimistic update: update credits immediately on pending, rollback on rejected
    condition: (p) => p.amount > 0,
  }
);

export const deductUserCredits = createAsyncThunk<
  { userId: string; amount: number; idempotencyKey: string },
  { userId: string; amount: number; reason: string; reference?: string },
  { rejectValue: { message: string; userId: string; amount: number } }
>(
  'adminUsers/deductUserCredits',
  async (p, { rejectWithValue }) => {
    const key = uuid();
    try {
      const res = await fetch('/api/credits/deduct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...p, idempotencyKey: key }),
      });
      if (!res.ok) throw new Error(await res.text());
      await res.json();
      return { userId: p.userId, amount: p.amount, idempotencyKey: key };
    } catch (e: any) {
      return rejectWithValue({ message: e?.message ?? 'Deduct credits failed', userId: p.userId, amount: p.amount });
    }
  },
  {
    condition: (p) => p.amount > 0,
  }
);

const findIndexById = (arr: AdminUserRow[], id: string) => arr.findIndex(u => u.id === id);

const adminUsersSlice = createSlice({
  name: 'adminUsers',
  initialState,
  reducers: {
    setUsers(state, action: PayloadAction<AdminUserRow[]>) {
      state.items = action.payload;
      state.status = 'succeeded';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch users';
      })
      // Optimistic add credits
      .addCase(addUserCredits.pending, (state, action) => {
        const { userId, amount } = action.meta.arg;
        const i = findIndexById(state.items, userId);
        if (i >= 0) {
          const curr = Number(state.items[i].creditsBalance || '0');
          state.items[i].creditsBalance = (curr + amount).toFixed(2);
        }
      })
      .addCase(addUserCredits.fulfilled, (state, action) => {
        // no-op; server already consistent, optimistic applied
      })
      .addCase(addUserCredits.rejected, (state, action) => {
        if (!action.payload) return;
        const { userId, amount } = action.payload;
        const i = findIndexById(state.items, userId);
        if (i >= 0) {
          const curr = Number(state.items[i].creditsBalance || '0');
          state.items[i].creditsBalance = (curr - amount).toFixed(2);
        }
      })
      // Optimistic deduct credits
      .addCase(deductUserCredits.pending, (state, action) => {
        const { userId, amount } = action.meta.arg;
        const i = findIndexById(state.items, userId);
        if (i >= 0) {
          const curr = Number(state.items[i].creditsBalance || '0');
          state.items[i].creditsBalance = (curr - amount).toFixed(2);
        }
      })
      .addCase(deductUserCredits.fulfilled, (state) => {
        // no-op
      })
      .addCase(deductUserCredits.rejected, (state, action) => {
        if (!action.payload) return;
        const { userId, amount } = action.payload;
        const i = findIndexById(state.items, userId);
        if (i >= 0) {
          const curr = Number(state.items[i].creditsBalance || '0');
          state.items[i].creditsBalance = (curr + amount).toFixed(2);
        }
      });
  },
});

export const { setUsers } = adminUsersSlice.actions;
export default adminUsersSlice.reducer;
