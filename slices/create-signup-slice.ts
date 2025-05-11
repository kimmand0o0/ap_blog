import type { StateCreator } from "zustand";

import { State } from "@/hooks/use-store";

export type TSignupInputLabel = "email" | "username" | "password";

type TSignupInput = {
  label: TSignupInputLabel;
  type: string;
  placeholder: string;
  validCondition: (value: string) => boolean;
  inValidMessage: string;
  duplicateMessage?: string;
  handleDuplicateCheck?: (value: string) => Promise<boolean>;
};

const EMAIL_DUPLICATE: TSignupInput = {
  label: "email",
  type: "email",
  placeholder: "Email",
  validCondition: (email: string): boolean => {
    const trimmed = email.trim();

    return (
      trimmed.includes("@") &&
      !trimmed.includes("..") &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)
    );
  },
  inValidMessage: "이메일 형식이 아닙니다.",
  duplicateMessage: "중복된 이메일 입니다.",
  handleDuplicateCheck: async (email: string) => {
    const response = await fetch("api/auth/duplicate-check/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  },
};

const NAME_DUPLICATE: TSignupInput = {
  label: "username",
  type: "string",
  placeholder: "Name",
  validCondition: (name: string): boolean => {
    const trimmed = name.trim();

    return (
      trimmed.length >= 2 &&
      trimmed.length <= 10 &&
      /^[a-zA-Z0-9가-힣]+$/.test(trimmed)
    );
  },
  inValidMessage: "별명은 2자 이상 10자 이하로 입력해주세요.",
  duplicateMessage: "중복된 별명입니다.",
  handleDuplicateCheck: async (username: string) => {
    const response = await fetch("/api/auth/duplicate-check/user-name", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });

    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  },
};

const PASSWORD_DUPLICATE: TSignupInput = {
  label: "password",
  type: "password",
  placeholder: "Password",
  validCondition: (password: string): boolean => {
    const trimmed = password.trim();

    return (
      trimmed.length >= 8 &&
      trimmed.length <= 20 &&
      /^(?=.*[a-zA-Z])(?=.*\d).{8,20}$/.test(trimmed)
    );
  },
  inValidMessage:
    "비밀번호는 영문과 숫자를 포함한 8자 이상 20자 이하로 입력해주세요.",
};

const DUPLICATE_INPUTS: TSignupInput[] = [
  EMAIL_DUPLICATE,
  NAME_DUPLICATE,
  PASSWORD_DUPLICATE,
];

type TSignupValue = {
  label: TSignupInputLabel;
  value: string;
  isValid: boolean;
  isChecked: boolean;
  isDuplicate: boolean;
};

export type TSignupSlice = {
  duplicateInputs: TSignupInput[];
  values: TSignupValue[] | undefined;

  findOneValue: (label: TSignupInputLabel) => TSignupValue | undefined;

  setValue: (label: TSignupInputLabel, value: string) => void;
  setIsValid: (label: TSignupInputLabel, isValid: boolean) => void;
  setIsChecked: (label: TSignupInputLabel, isChecked: boolean) => void;
  setIsDuplicate: (label: TSignupInputLabel, isDuplicate: boolean) => void;
  getSignupVerification: () => boolean;
};

export const createSignupSlice: StateCreator<
  Partial<State>,
  [],
  [],
  TSignupSlice
> = (set, get) => ({
  duplicateInputs: DUPLICATE_INPUTS,
  values: DUPLICATE_INPUTS.map((input) => {
    return {
      label: input.label,
      value: "",
      isValid: true,
      isChecked: input.label === "password",
      isDuplicate: input.label === "password",
    };
  }),

  findOneValue: (label: TSignupInputLabel) => {
    const { values } = get();
    if (!values) return undefined;

    return values.find((input) => input.label === label);
  },

  setValue: (label: TSignupInputLabel, value: string) => {
    set((state) => ({
      values: state.values?.map((input) => {
        if (input.label === label) {
          return { ...input, value };
        }
        return input;
      }),
    }));
  },

  setIsValid: (label: TSignupInputLabel, isValid: boolean) => {
    set((state) => ({
      values: state.values?.map((input) => {
        if (input.label === label) {
          return { ...input, isValid };
        }
        return input;
      }),
    }));
  },

  setIsChecked: (label: TSignupInputLabel, isChecked: boolean) => {
    set((state) => ({
      values: state.values?.map((input) => {
        if (input.label === label) {
          return { ...input, isChecked };
        }
        return input;
      }),
    }));
  },

  setIsDuplicate: (label: TSignupInputLabel, isDuplicate: boolean) => {
    set((state) => ({
      values: state.values?.map((input) => {
        if (input.label === label) {
          return { ...input, isDuplicate };
        }
        return input;
      }),
    }));
  },

  getSignupVerification: () => {
    const { values } = get();

    if (!values) return false;

    return values.every((input) => {
      return (
        input.isValid &&
        input.isChecked &&
        input.isDuplicate &&
        input.value.length > 0
      );
    });
  },
});
