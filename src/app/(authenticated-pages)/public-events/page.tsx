"use client";

import PostCardSkeleton from "@/components/post/postCardSkeleton";
import PostFilter from "@/components/post/postFilter";
import { Button } from "@/components/ui/button";
import ImageWithFallback from "@/components/ui/imageWithFallback";
import { htmlToPlainText, truncateText } from "@/lib/helper";
import { getPublicEvents, PublicEvent } from "@/serverActions/crudPublicEvents";
import { useEffect, useState } from "react";
import { CalendarDays, Clock, MapPin } from "lucide-react"; // for icons
import Container from "@/components/ui/container";

export default function PublicEventsPage() {
  const [data, setData] = useState<PublicEvent[]>([]);
  const [sortedData, setSortedData] = useState<PublicEvent[]>([]);
   const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getPublicEvents({
      orderBy: 'date',
      order: 'ASC'
    }).then((res) => {
      setData(res.data || [])
      setSortedData(res.data || [])
      setIsLoading(false)
    });
  }, []);

  return (
    <Container className="space-y-2">
      <div className="sticky top-0 bg-body-blend p-1">
        <PostFilter defaultOrder="asc" data={data || []} onChange={setSortedData} />
      </div>
        {isLoading && <SkeletonGrid />}

      {isLoading && sortedData.length === 0 ? (
        <div className="text-center text-muted-foreground py-10">
          No data available
        </div>
      ) : (
        <div className="grid">
          <div className="grid md:grid-cols-3 lg:grid-cols-4 flex-wrap gap-5 gap-y-10 w-full-sidebar">
            {sortedData != null &&  sortedData.map((i) => (
              <Card key={i.id} item={i} />
            ))}
          </div>
        </div>
      )}
    </Container>
  );
}

function Card({ item }: { item: PublicEvent }) {
  return (
    <div className="card rounded-lg p-4 min-w-[200px] flex flex-col gap-4 text-sm border">
      <ImageWithFallback
        className="rounded-sm w-full h-[140px] object-cover"
        width={200}
        height={100}
        src={item.image}
        alt={item.title}
      />

      {/* Title */}
      <p className="text-base font-medium">{item.title}</p>

      {/* Date & Time */}
      <div className="flex flex-col gap-1 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4" />
          <span>
            {new Date(item.date).toLocaleDateString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>{item.time}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span>{item.location}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-muted-foreground text-xs">
        {truncateText(htmlToPlainText(item.description), 150)}
      </p>

      {/* Button */}
      <div className="flex">
        <Button
          target="_blank"
          href={item.link}
          className="ml-auto"
          variant="outline"
        >
          Join
        </Button>
      </div>
    </div>
  );
}


// 🔹 Skeleton Loader for the grid
function SkeletonGrid() {
  return (
    <div className="grid md:grid-cols-3 lg:grid-cols-4 flex-wrap gap-5 gap-6 w-full-sidebar">
      {Array.from({ length: 4 }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  );
}
