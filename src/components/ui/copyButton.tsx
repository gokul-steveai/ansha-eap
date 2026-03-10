"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

type CopyButtonProps = {
  value: string;
  label?: string; // optional, for button text
};

export function CopyButton({ value, label }: CopyButtonProps) {
  

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Copied to clipboard", {
        description: value,
      });
    } catch (err) {
      toast.error("Failed to copy", {
        description: err as string,
      });
    }
  };

  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <Button
          onClick={handleCopy}
          variant="ghost"
          size="sm"
          className="flex items-center gap-1"
        >
          {label && <span>{label}</span>}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p className="font-medium">Copy</p>
      </TooltipContent>
    </Tooltip>
  );
}
