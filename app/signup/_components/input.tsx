import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { cn } from "@/lib/utils";

import useStore from "@/hooks/use-store";

import { TSignupInputLabel } from "@/slices/create-signup-slice";

interface DuplicateCheckInputProps {
  label: TSignupInputLabel;
  type: string;
  placeholder: string;
  validCondition: (value: string) => boolean;
  inValidMessage: string;
  duplicateMessage: string;
  handleDuplicateCheck?: (value: string) => Promise<boolean>;
}

export default function SignupInput({
  label,
  type,
  placeholder,
  validCondition,
  inValidMessage,
  duplicateMessage,
  handleDuplicateCheck,
}: DuplicateCheckInputProps) {
  const { findOneValue, setValue, setIsValid, setIsChecked, setIsDuplicate } =
    useStore();

  const { value, isChecked, isDuplicate, isValid } = findOneValue(label)!;

  useEffect(() => {
    const isValid = validCondition(value);

    setIsValid(label, isValid);
  }, [value]);

  return (
    <div className="w-full flex flex-col space-y-1.5">
      <Label htmlFor={label}>{placeholder}</Label>
      <div className="flex w-full items-center space-x-2">
        <Input
          id={label}
          type={type}
          value={value}
          onChange={(event) => {
            if (isChecked && label !== "password") setIsChecked(label, false);
            setValue(label, event.target.value);
          }}
          placeholder={placeholder}
        />
        {duplicateMessage && (
          <Button
            onClick={async () => {
              if (!handleDuplicateCheck) return;
              if (!isValid) {
                setIsDuplicate(label, false);
                return;
              }
              const isDuplicate = await handleDuplicateCheck(value);

              setIsDuplicate(label, isDuplicate);
              setIsChecked(label, true);
            }}
            disabled={isChecked && isDuplicate}
          >
            중복확인
          </Button>
        )}
      </div>
      {!isValid && (
        <div className="text-sm pl-1.5 text-neutral-400">{inValidMessage}</div>
      )}
      {duplicateMessage && isChecked && (
        <div
          className={cn(
            "text-sm pl-1.5",
            isDuplicate ? "text-blue-400" : "text-red-400"
          )}
        >
          {isDuplicate ? "사용 할 수 있습니다." : duplicateMessage}
        </div>
      )}
    </div>
  );
}
