"use client";

import { useEffect, useState } from "react";

export function useMediaQuery() {
  const [screens, setScreens] = useState({
    isScreenSm: false,
    isScreenMd: false,
    isScreenLg: false,
    isScreenXl: false,
    isScreen2xl: false,
  });

  useEffect(() => {
    const queries = {
      isScreenSm: window.matchMedia("(max-width: 767px)"),
      isScreenMd: window.matchMedia("(min-width: 768px) and (max-width: 1023px)"),
      isScreenLg: window.matchMedia("(min-width: 1024px) and (max-width: 1279px)"),
      isScreenXl: window.matchMedia("(min-width: 1280px) and (max-width: 1535px)"),
      isScreen2xl: window.matchMedia("(min-width: 1536px)"),
    };

    const updateScreens = () => {
      setScreens({
        isScreenSm: queries.isScreenSm.matches,
        isScreenMd: queries.isScreenMd.matches,
        isScreenLg: queries.isScreenLg.matches,
        isScreenXl: queries.isScreenXl.matches,
        isScreen2xl: queries.isScreen2xl.matches,
      });
    };

    // Initial check
    updateScreens();

    // Add listeners
    Object.values(queries).forEach((q) =>
      q.addEventListener("change", updateScreens)
    );

    return () => {
      Object.values(queries).forEach((q) =>
        q.removeEventListener("change", updateScreens)
      );
    };
  }, []);

  return screens;
}
