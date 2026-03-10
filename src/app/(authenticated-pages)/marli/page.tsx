"use client";

import PostCardSkeleton from "@/components/post/postCardSkeleton";
import PostFilter from "@/components/post/postFilter";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import ImageWithFallback from "@/components/ui/imageWithFallback";
import { htmlToPlainText, truncateText } from "@/lib/helper";
import { getMarlis, Marli } from "@/serverActions/crudMarli";
import { useEffect, useState } from "react";

export default function MarliPage() {
  const [data, setData] = useState<Marli[] | null>(null);
  const [sortedData, setSortedData] = useState<Marli[] | null>(data);

  // keep sortedData in sync when base data changes
  useEffect(() => {
    setSortedData(data);
  }, [data]);

  useEffect(() => {
    getMarlis().then((res) => setData(res.data || []));
  }, []);

  return (
    <Container className="space-y-2">
      <div className="sticky top-0 bg-body-blend p-1">
        <PostFilter data={data || []} onChange={setSortedData} />
      </div>
        {sortedData == null && <SkeletonGrid />}

      {sortedData != null && sortedData.length === 0 ? (
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

function Card({ item }: { item: Marli }) {
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
          View
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
