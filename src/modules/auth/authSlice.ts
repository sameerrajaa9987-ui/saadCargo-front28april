import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser } from "./types";

type AuthState = {
  accessToken: string | null;
  user: AuthUser | null;
};

const STORAGE_KEY = "saadcargo.auth";

function loadState(): AuthState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { accessToken: null, user: null };
    const parsed = JSON.parse(raw) as AuthState;
    return {
      accessToken: parsed.accessToken ?? null,
      user: parsed.user ?? null,
    };
  } catch {
    return { accessToken: null, user: null };
  }
}

function persistState(state: AuthState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

const initialState: AuthState = loadState();

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(
      state,
      action: PayloadAction<{ accessToken: string; user: AuthUser }>,
    ) {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      persistState(state);
    },
    clearAuth(state) {
      state.accessToken = null;
      state.user = null;
      persistState(state);
    },
  },
});

export const { setAuth, clearAuth } = slice.actions;
export default slice.reducer;
