"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { getPublicEvents, PublicEvent } from "@/serverActions/crudPublicEvents";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import ImageWithFallback from "../ui/imageWithFallback";
import { htmlToPlainText, truncateText } from "@/lib/helper";

const DURATION = 5000; // ms
const BAR_WIDTH = 40;
const CIRCLE_SIZE = 8;

export default function PublicEventsCarousel({
    maxCount = 3,
  className,
  autoplay = false,
}: {
    maxCount?: number;
  className?: string;
  autoplay?: boolean;
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(maxCount);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [events, setEvents] = useState<PublicEvent[] | []>([]);

  useEffect(() => {
    getPublicEvents({
      limit: maxCount,
      orderBy: "date",
      order: "ASC",
    }).then((res) => {
        setEvents(res.data || [])
    });

  }, [maxCount]);

  useEffect(() => {
    if (!api) return;

    const total = api.scrollSnapList().length;
    setCount(total);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });

    // Always clear old interval before setting a new one
    if (intervalRef.current) clearInterval(intervalRef.current);

    // Only autoplay if we have real content
    if (autoplay && events.length > 0) {
      intervalRef.current = setInterval(() => {
        if (!api) return;
        const nextIndex = (api.selectedScrollSnap() + 1) % total;
        api.scrollTo(nextIndex); // triggers on("select")
      }, DURATION);
    }

    // Cleanup
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [api, events, autoplay]);

  return (
    <div>
      <Carousel setApi={setApi} className={cn("w-full", className)}>
        <CarouselContent>
          {events.length > 0
            ? events.map((event, index) => (
                <CarouselItem key={event.id + index}>
                  <PublicEventCard event={event} />
                </CarouselItem>
              ))
            : Array.from({ length: count }).map((_, index) => {
                return (
                  <CarouselItem key={index}>
                    <Skeleton />
                  </CarouselItem>
                );
              })}
        </CarouselContent>
      </Carousel>

      {/* Progress indicators */}
      <div className="mx-auto mt-4 flex w-full max-w-lg justify-center gap-3">
        {Array.from({ length: count }).map((_, index) => {
          const isActive = current === index + 1;
          return (
            <motion.span
              key={index}
              layout
              initial={false}
              animate={{
                // width: isActive ? BAR_WIDTH : CIRCLE_SIZE,
                width: CIRCLE_SIZE,
                height: CIRCLE_SIZE,
                borderRadius: isActive ? 8 : 999,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.4,
              }}
              className="bg-foreground/10 relative block overflow-hidden"
              style={{
                minWidth: CIRCLE_SIZE,
                maxWidth: BAR_WIDTH,
                border: "none",
              }}
            >
              {events.length > 0 && isActive && (
                <motion.div
                  key={`progress-${index}-${current}`}
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  {...(autoplay && {
                    transition: { duration: DURATION / 1000, ease: "linear" },
                  })}
                  className="bg-primary absolute top-0 left-0 h-full rounded-lg"
                />
              )}
            </motion.span>
          );
        })}
      </div>
    </div>
  );
}

function PublicEventCard({
  event,
  className,
}: {
  event: PublicEvent;
  className?: string;
}) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={event.link || "#"}
      className={cn(
        "flex items-center justify-between rounded-xl gap-6",
        className
      )}
    >
      <ImageWithFallback
        iconSize={64}
        className="object-cover w-16 h-16 rounded bg-gray-200"
        width={64}
        height={64}
        alt={event.title}
        src={event.image || ""}
      />
      <div className="flex-1 line-clamp-2">
        <p className="font-medium">{event.title}</p>
        <p className="text-xs muted-text">
          {truncateText(htmlToPlainText(event.description), 50)}
        </p>
      </div>
      <div className="tracking-wider text-center font-bold">
        <p className="text-lg uppercase">
          {event.date.toLocaleDateString("en-US", {
            month: "short",
          })}
        </p>
        <p className="text-xs">
          {event.date.toLocaleDateString("en-US", {
            day: "numeric",
          })}
        </p>
      </div>
    </a>
  );
}

// Simple skeleton while loading
function Skeleton() {
  return (
    
      <div className="animate-pulse flex items-center justify-between rounded-xl gap-6">
        <div className="w-16 h-16 bg-gray-300 rounded" />
        <div className="flex-1 line-clamp-2 space-y-1">
          <div className="h-6 bg-gray-300 rounded w-3/4" />
          <div className="h-2 bg-gray-300 rounded w-1/2" />
        </div>
        <div className="w-10 h-10 bg-gray-300 rounded" />
      </div>
    
  );
}
