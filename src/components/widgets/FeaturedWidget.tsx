"use client";

import { usePostServiceContext } from "@/context/postServiceContext";
import { cn } from "@/lib/utils";
import { getFeaturedContents } from "@/serverActions/crudFeaturedContent";
import { Posts } from "@/serverActions/crudPosts";
import { Crown } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import ImageWithFallback from "../ui/imageWithFallback";

const FeaturedWidget = ({ className }: { className?: string }) => {
  const { allPosts, generatePostLink } = usePostServiceContext();
  const [featuredPosts, setFeaturedPosts] = useState<Posts | null>(null);
  

  useEffect(() => {
    async function fetchFeatured() {
      
      const res = await getFeaturedContents();
      
      if (res.data && res.data.length > 0) {
        // match posts by ids array
        const ids = res.data[0].ids;
        const matches = allPosts.filter((post) => ids.includes(post.id));
        setFeaturedPosts(matches);
      } else {
        setFeaturedPosts([]);
      }
      
    }

    if (allPosts.length > 0) {
      fetchFeatured();
    }
  }, [allPosts]);

  const featuredPost = featuredPosts ? featuredPosts[0] : null
  
  return (
    <div className="relative h-full">
    <Crown size={30} className="z-10 bg-white/80 rounded-full p-1 right-2 top-2 absolute text-yellow-500 fill-yellow-500" />
    {featuredPost ?
     <div className={cn("text-white rounded-lg p-4 w-1/4 min-w-[280px] w-full flex flex-col gap-5 text-sm", className)}>
      
        <ImageWithFallback
          className="rounded-sm w-full h-[130px] object-cover object-top"
          width={270}
          height={130}
          src={featuredPost.thumbnail}
          alt={featuredPost.title || ""}
        />
      

      <p className="text-base font-medium">{featuredPost.title}</p>

      <div className="flex mt-auto">
        <Button className="ml-auto capitalize bg-transparent !border-white !ring-white text-white" variant="outline" href={generatePostLink(featuredPost)}>
          view
        </Button>
      </div>
    </div>
  : <div
      className={cn(
        "rounded-lg p-4 w-1/4 min-w-[280px] w-full flex flex-col gap-5 text-sm animate-pulse",
        className
      )}
    >
      {/* Thumbnail */}
      <div className="rounded-sm w-full h-[130px] bg-zinc-200" />

      {/* Title */}
      <div className="h-5 w-3/4 bg-zinc-200 rounded" />

      {/* Description */}
      <div className="space-y-2">
        <div className="h-3 w-full bg-zinc-200 rounded" />
        <div className="h-3 w-5/6 bg-zinc-200 rounded" />
      </div>

      {/* Footer */}
      <div className="flex mt-auto items-center">
        <div className="ml-auto h-8 w-16 bg-zinc-200 rounded" />
      </div>
    </div>}
    
    
    </div>
   
  );
};

export default FeaturedWidget;
