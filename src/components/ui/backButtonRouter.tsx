"use client";
import { ChevronLeft } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "./button";
import { cn } from "@/lib/utils";

export default function BackButtonRouter() {
    const path = usePathname();
    const paths = path.split("/").filter(Boolean);
    paths.pop();
    const prevPage = "/" + paths.join("/");
    const isDashboard = path === "/dashboard";
  return (
    <>
      <Button
        href={prevPage || "/dashboard"}
        variant="ghost"
        size="icon"
        className={cn("aspect-square", isDashboard && "invisible")}
      >
        <ChevronLeft className="!h-5 !w-5" strokeWidth={2} />
        
      </Button>
      
    </>
  );
}
