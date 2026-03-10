"use client";
import { htmlToPlainText, truncateText } from "@/lib/helper";
import { getPublicEvents, PublicEvent } from "@/serverActions/crudPublicEvents";
import { useEffect, useState } from "react";
import ImageWithFallback from "../ui/imageWithFallback";
import { cn } from "@/lib/utils";

// This replaces PublicEventsList with client-side fetching
export default function PublicEventsList({count = 2,className}:{count?:number, className?:string}) {
  const [events, setEvents] = useState<PublicEvent[] | null>(null);

  
  useEffect(() => {
    getPublicEvents({
      limit: count,
      orderBy: 'date',
      order: 'ASC'
    }).then((res) => setEvents(res.data || []));
  }, [count]);

  if (!events) return <PublicEventsSkeleton />;

  return (
    <div className="space-y-2">
      {events.map((event) => (
        <PublicEventCard className={className} key={event.id} event={event} />
      ))}
    </div>
  );
}

function PublicEventCard({ event, className }: { event: PublicEvent, className?:string }) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={event.link || "#"}
      className={cn("max-md:!bg-[#70958517] flex items-center justify-between p-4 md:border rounded-xl space-x-4", className)}
    >
      <ImageWithFallback
        iconSize={40}
        className="object-cover w-12 h-12 rounded bg-gray-200"
        width={40}
        height={40}
        alt={event.title}
        src={event.image || ""}
      />
      <div className="flex-1 line-clamp-2">
        <p className="md:!text-sm font-medium muted-text">{event.title}</p>
        <p className="max-md:text-xs muted-text">{truncateText(htmlToPlainText(event.description), 50)}</p>
      </div>
      <div className="tracking-wider text-center font-bold">
          <p>{event.date.toLocaleDateString("en-US", {
        month: "short",
      })}</p>
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
function PublicEventsSkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(1)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse flex items-center justify-between p-4 border rounded-xl space-x-4"
        >
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
          <div className="flex-1 space-y-1">
            <div className="h-3 bg-gray-200 rounded w-3/4" />
            <div className="h-2 bg-gray-200 rounded w-1/2" />
          </div>
          <div className="w-6 h-6 bg-gray-200 rounded-full" />
        </div>
      ))}
    </div>
  );
}


