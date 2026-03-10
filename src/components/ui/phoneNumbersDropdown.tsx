"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { Copy, Phone } from "lucide-react";

interface NumberDropdownProps {
  contents?: string[];
}

export default function NumberDropdown({ contents = [] }: NumberDropdownProps) {
  const handleCall = (num: string) => {
    window.location.href = `tel:${num}`;
  };

  const handleCopy = (num: string) => {
    navigator.clipboard.writeText(num);
    alert(`Copied ${num}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"outline"} className="w-full">Get numbers</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[400px] w-full p-2">
        {contents.length > 0 ? (
          contents.map((num) => (
            <div
              key={num}
              className=" w-full flex items-center justify-between gap-2 p-2 hover:bg-gray-100 rounded"
            >
              <span className="font-mono">{num}</span>
              <div className="flex gap-2">
                <Button className="opacity-50" size="sm" variant="ghost" onClick={() => handleCopy(num)}><Copy /></Button>
                <Button size="sm" variant="default" onClick={() => handleCall(num)}><Phone /> Call</Button>
              </div>
            </div>
          ))
        ) : (
          <span className="text-sm text-muted-foreground">No numbers available</span>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
