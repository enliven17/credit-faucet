import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type FaucetState = {
  lastRequestAtByTwitterId: Record<string, string>; // ISO timestamp
};

const initialState: FaucetState = {
  lastRequestAtByTwitterId: {},
};

const faucetSlice = createSlice({
  name: "faucet",
  initialState,
  reducers: {
    setLastRequest(
      state,
      action: PayloadAction<{ twitterId: string; isoTimestamp: string }>
    ) {
      state.lastRequestAtByTwitterId[action.payload.twitterId] =
        action.payload.isoTimestamp;
    },
  },
});

export const { setLastRequest } = faucetSlice.actions;
export default faucetSlice.reducer;

