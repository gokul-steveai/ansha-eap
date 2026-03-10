"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PageLoader({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Wrap router.push and router.replace to trigger loader
    const originalPush = router.push;
    const originalReplace = router.replace;

    router.push = ((...args: Parameters<typeof router.push>) => {
      setIsLoading(true);
      return originalPush.apply(router, args);
    }) as typeof router.push;

    router.replace = ((...args: Parameters<typeof router.replace>) => {
      setIsLoading(true);
      return originalReplace.apply(router, args);
    }) as typeof router.replace;

    return () => {
      router.push = originalPush;
      router.replace = originalReplace;
    };
  }, [router]);

  // Hide loader after new pathname renders
  useEffect(() => {
        setIsLoading(false)
  }, [pathname]);

  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-50">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-400 border-t-transparent"></div>
        </div>
      )}
      {children}
    </>
  );
}
