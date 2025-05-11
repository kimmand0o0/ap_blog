import type { StateCreator } from "zustand";

import { State } from "@/hooks/use-store";

export type TUserRole = "USER" | "ADMIN";

export type TUserSlice = {
  isLoggedIn: boolean;

  email: string;
  username: string;
  role: TUserRole;

  setUser: (email: string, username: string, role: TUserRole) => void;
};

export const createUserSlice: StateCreator<
  Partial<State>,
  [],
  [],
  TUserSlice
> = (set) => ({
  isLoggedIn: false,

  email: "",
  username: "",
  role: "USER",

  setUser: (email: string, username: string, role: TUserRole) =>
    set({ email, username, role }),
});
