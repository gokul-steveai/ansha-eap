"use client";

import { usePostServiceContext } from "@/context/postServiceContext";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";


const BreadcrumbMobile = () => {
  const {categories} = usePostServiceContext()
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);
  const isRoot = paths.length === 0;

  const formatLabel = (segment: string) => {
    if (!segment) return "Home";

    if (segment.includes("~")) {
      // Post title for display
      return decodeURIComponent(segment.split("~")[1])
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }

    // Check category
    const category = categories.find((c) => c.id === segment || c.label === segment);
    if (category) return category.label;

    // Fallback
    return decodeURIComponent(segment)
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  // Current label
  const currentLabel = isRoot ? "Home" : formatLabel(paths[paths.length - 1]);

  // Back href:
  // Take all previous segments as-is (keep IDs + slugs)
  let backHref = "/";
  if (!isRoot) {
    const previousSegments = paths.slice(0, paths.length - 1);
    backHref = "/" + previousSegments.join("/");
  }

  return (
    <nav className="sticky top-0 z-10 flex items-center gap-2 bg-body-blend px-2 py-2 text-sm text-muted-foreground">
      {!isRoot && (
        <Link href={backHref || "/"} className="flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" />
          <span className="sr-only">Back</span>
        </Link>
      )}
      <span className="font-medium text-foreground">{currentLabel}</span>
    </nav>
  );
};

export default BreadcrumbMobile;
