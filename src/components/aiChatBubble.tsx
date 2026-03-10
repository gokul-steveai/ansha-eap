"use client";

import { useEffect, useRef, useState } from "react";

type ChatBubbleProps = {
  agentId: string;
  width?: string;  // e.g. "448px"
  height?: string; // e.g. "559px"
  scriptId?: string;
  containerId?: string;
};

export default function ChatBubble({
  agentId,
  width = "448px",
  height = "559px",
  scriptId = "chattera-chatbubble-script",
  containerId = "chattera-chatbubble-container",
}: ChatBubbleProps) {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !agentId || !containerRef.current) return;

    // Normalize width/height (strip px)
    const w = String(width).replace(/px$/, "");
    const h = String(height).replace(/px$/, "");

    // Prevent duplicate script injection
    if (document.getElementById(scriptId)) return;

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = `https://chattera.co/embed/chatbubble?agentId=${encodeURIComponent(
      agentId
    )}&w=${encodeURIComponent(w)}px&h=${encodeURIComponent(h)}px`;
    script.async = true;

    containerRef.current.appendChild(script);

    return () => {
      const existing = document.getElementById(scriptId);
      if (existing) existing.remove();
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [mounted, agentId, width, height, scriptId]);

  if (!mounted) return null; // don’t render anything on server

  return <div id={containerId} ref={containerRef} suppressHydrationWarning />;
}
