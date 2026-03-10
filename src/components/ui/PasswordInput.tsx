"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Lock, Eye, EyeClosed } from "lucide-react";
import { ChangeEventHandler, useState } from "react";

interface PasswordInputProps {
  id: string;
  placeholder?: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  className?: string;
  showEyeIcon?: boolean;
}

export function PasswordInput({
  id,
  placeholder,
  value,
  onChange,
  className,
  showEyeIcon = true,
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className={cn("relative", className)}>
      <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50">
        <Lock className="size-4" />
        <span className="sr-only">password</span>
      </div>
      <Input
        className="px-9"
        id={id}
        type={isVisible ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
      />
      {showEyeIcon && (
        <div 
        className="cursor-pointer hover:text-primary text-muted-foreground absolute inset-y-0 right-0 flex items-center justify-center pr-3 peer-disabled:opacity-50"
        onClick={()=> {
          setIsVisible(!isVisible)
        }}>
          {isVisible ? <Eye className="size-4" /> : <EyeClosed className="size-4" />}
          <span className="sr-only">password</span>
        </div>
      )}
    </div>
  );
}
