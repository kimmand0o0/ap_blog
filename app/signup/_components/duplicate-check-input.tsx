import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DuplicateCheckInputProps {
  label: string;
  type: string;
  placeholder: string;
  validCondition: (value: string) => boolean;
  inValidMessage: string;
  duplicateMessage: string;
}

export default function DuplicateCheckInput({
  label,
  type,
  placeholder,
  validCondition,
  inValidMessage,
  duplicateMessage,
}: DuplicateCheckInputProps) {
  const [value, setValue] = useState("");

  const [isValid, setIsValid] = useState(true);
  const [isDuplicate, setIsDuplicate] = useState(false);

  useEffect(() => {
    setIsValid(validCondition(value));
  }, [value]);

  return (
    <div className="w-full flex flex-col space-y-1.5">
      <Label htmlFor={label}>{placeholder}</Label>
      <div className="flex w-full items-center space-x-2">
        <Input
          id={label}
          type={type}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
        />
        <Button>중복확인</Button>
      </div>
      {!isValid && (
        <div className="text-sm pl-1.5 text-neutral-400">{inValidMessage}</div>
      )}
      {isDuplicate && (
        <div className="text-sm pl-1.5 text-red-400">{duplicateMessage}</div>
      )}
    </div>
  );
}
