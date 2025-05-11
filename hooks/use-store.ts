import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { createSignupSlice, TSignupSlice } from "@/slices/create-signup-slice";
import { createUserSlice, TUserSlice } from "@/slices/create-user-slice";

export type State = TSignupSlice & TUserSlice;

const useStore = create<State>()(
  devtools((...a) => ({
    ...createSignupSlice(...a),
    ...createUserSlice(...a),
  }))
);

export default useStore;
