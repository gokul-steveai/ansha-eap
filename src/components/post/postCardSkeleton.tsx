import { cn } from "@/lib/utils";

const PostCardSkeleton = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "card skeleton rounded-lg p-4 w-1/4 min-w-[280px] w-full flex flex-col gap-5 text-sm animate-pulse",
        className
      )}
    >
      {/* Thumbnail */}
      <div className="img rounded-sm w-full h-[167px] bg-zinc-200" />

      {/* Title */}
      <div className="h-5 w-3/4 bg-zinc-200 rounded" />

      {/* Description */}
      <div className="space-y-2">
        <div className="h-3 w-full bg-zinc-200 rounded" />
        <div className="h-3 w-5/6 bg-zinc-200 rounded" />
      </div>

      {/* Footer */}
      <div className="flex mt-auto items-center">
        <div className="flex flex-row items-center gap-2">
          <div className="h-4 w-4 bg-zinc-200 rounded-full" />
          <div className="h-3 w-10 bg-zinc-200 rounded" />
        </div>
        <div className="ml-auto h-8 w-16 bg-zinc-200 rounded" />
      </div>
    </div>
  );
};

export default PostCardSkeleton;
