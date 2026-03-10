import { cn } from "@/lib/utils";

const WeeklyBitesRowSkeleton = ({ className }: { className?: string }) => {
  return (
    <tr
      className={cn(
        "text-xs rounded-lg border border-zinc-200 animate-pulse",
        className
      )}
    >
      {/* Thumbnail */}
      <td className="w-[80px] p-2">
        <div className="h-8 w-12 bg-zinc-200 rounded" />
      </td>

      {/* Title & Author */}
      <td className="p-2">
        <div className="space-y-1">
          <div className="h-3 w-3/4 bg-zinc-200 rounded" />
          <div className="h-2 w-1/2 bg-zinc-200 rounded" />
        </div>
      </td>

      {/* Duration/Action */}
      <td className="w-[100px] p-2">
        <div className="h-3 w-16 bg-zinc-200 rounded mx-auto" />
      </td>

      {/* Likes */}
      <td className="w-[80px] p-2">
        <div className="flex flex-row gap-2 items-center">
          <div className="h-4 w-4 bg-zinc-200 rounded-full" />
          <div className="h-3 w-6 bg-zinc-200 rounded" />
        </div>
      </td>

      {/* Button */}
      <td className="w-[100px] p-2">
        <div className="h-7 w-full bg-zinc-200 rounded-lg" />
      </td>
    </tr>
  );
};

export const WeeklyBitesTableSkeleton = ({ rows = 5 }) => {
  return (
    <table className="w-full [&_td]:p-2 bordered-rows rounded-rows border-separate border-spacing-x-0 border-spacing-y-2">
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <WeeklyBitesRowSkeleton key={i} />
        ))}
      </tbody>
    </table>
  );
};
