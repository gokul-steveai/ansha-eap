"use client";

import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { motion } from "motion/react";


const DURATION = 5000; // ms
const BAR_WIDTH = 40;
const CIRCLE_SIZE = 10;

export default function CarouselWithPagination() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);


  React.useEffect(() => {
    if (!api) return;

    const total = api.scrollSnapList().length;
    setCount(total);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });

    // clear existing interval
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (!api) return;
      const nextIndex = (api.selectedScrollSnap() + 1) % total;
      api.scrollTo(nextIndex); // let this trigger select → setCurrent
    }, DURATION);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [api]);

  return (
    <div className="mx-auto max-w-xs">
      <Carousel setApi={setApi} className="w-full max-w-xs">
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index}
            className="basis-[80%]"
            >
              <Card>
                <CardContent className="flex aspect-video items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      {/* Progress indicators */}
      <div className="mx-auto mt-8 flex w-full max-w-lg justify-center gap-3">
        {Array.from({ length: count }).map((_, index) => {
          const isActive = current === index + 1;
          return (
            <motion.span
              key={index}
              layout
              initial={false}
              animate={{
                width: isActive ? BAR_WIDTH : CIRCLE_SIZE,
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
              {isActive && (
                <motion.div
                  key={`progress-${index}-${current}`}
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: DURATION / 1000, ease: "linear" }}
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
