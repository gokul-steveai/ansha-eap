// components/ui/tabs.tsx
"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// === TabsList variants ===
const tabsListVariants = cva(
  "inline-flex items-center justify-center w-fit",
  {
    variants: {
      variant: {
        default:
          "bg-muted text-muted-foreground h-9 rounded-lg p-[3px]",
        underlined:
          "w-full p-0 bg-background justify-start border-b rounded-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// === TabsTrigger variants ===
const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center px-2 py-1 text-sm font-medium transition whitespace-nowrap disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default:
          "h-[calc(100%-1px)] border border-transparent rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground",
        underlined:
          "rounded-none bg-background border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// === Component Definitions ===

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

interface TabsListProps
  extends React.ComponentProps<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {}

function TabsList({ className, variant, ...props }: TabsListProps) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  );
}

interface TabsTriggerProps
  extends React.ComponentProps<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof tabsTriggerVariants> {}

function TabsTrigger({ className, variant, ...props }: TabsTriggerProps) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(tabsTriggerVariants({ variant }), className)}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
