"use client";

import { cn } from "@/lib/utils";
import { ReactNode, useEffect, useRef, useState } from "react";

type WillFocusedProps = {
  children: (props: {
    isFocused: boolean;
    focusOnChange: (value: boolean) => void;
  }) => ReactNode;
  className?:string;
  focusedClassName?:string;
};

const WillFocused = ({ children, className, focusedClassName}: WillFocusedProps) => {
  
  const ref = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    function handlePointerDown(e: PointerEvent) {
      const target = e.target as HTMLElement | null;
      const inside = target?.closest(".will-focused") === ref.current;

      if (!inside) {
        setFocused(false)
      } else {
        // clicked inside → focus
        setFocused(true)
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const focusOnChange = (value: boolean) => {
    setFocused(value)
  };


  function setFocused(state:boolean){
    if(state){
      document
      .querySelectorAll(".overflow-auto")
      .forEach((el) => el.classList.add("overflow-visible"));
      setIsFocused(true);
    } else {
      setIsFocused(false);

      setTimeout(() => {
        document
          .querySelectorAll(".overflow-auto.overflow-visible")
          .forEach((el) => el.classList.remove("overflow-visible"));
      }, 300);
    }
  
  }
  return (
    <div
      ref={ref}
      className={cn("will-focused h-fit w-full transition-all", className, isFocused && "focused", isFocused && focusedClassName)}
    >
      {children({ isFocused, focusOnChange })}
    </div>
  );
};

export default WillFocused;
