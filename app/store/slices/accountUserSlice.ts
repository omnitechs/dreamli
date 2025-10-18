import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AccountUser = {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  creditsBalance: string; // keep as string (Decimal serialized)
  createdAt: string; // ISO
};

const initialState: { me: AccountUser | null } = { me: null };

const accountUserSlice = createSlice({
  name: 'accountUser',
  initialState,
  reducers: {
    hydrateMe(state, action: PayloadAction<AccountUser | null>) {
      state.me = action.payload;
    },
    adjustMyCredits(state, action: PayloadAction<{ userId: string; delta: number }>) {
      if (!state.me) return;
      const { userId, delta } = action.payload;
      if (state.me.id !== userId) return;
      const curr = Number(state.me.creditsBalance ?? '0');
      const next = (curr + delta);
      // Keep two decimals formatting similar to DB scale
      state.me.creditsBalance = next.toFixed(2);
    },
  },
});

export const { hydrateMe, adjustMyCredits } = accountUserSlice.actions;
export default accountUserSlice.reducer;
