"use client"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowDown01, ArrowDownAZ, ArrowUp01, ArrowUpAZ } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";


type SortProps = "date" | "title";
type OrderProps = "asc" | "desc";

type Sortable = {
  created_at: string;
  title: string;
  
};

type PostFilterProps<T extends Sortable> = {
  data: T[];
  onChange: (sorted: T[]) => void;
  defaultOrder?: OrderProps;
};

const PostFilter = <T extends Sortable>({ data, onChange, defaultOrder }: PostFilterProps<T>) => {
  const [sortBy, setSortBy] = useState<SortProps>("date");
  const [order, setOrder] = useState<OrderProps>(defaultOrder ?? "desc");

  const OrderIcon =
    sortBy === "date"
      ? order === "asc"
        ? ArrowUp01
        : ArrowDown01
      : order === "asc"
        ? ArrowUpAZ
        : ArrowDownAZ;


  // ✅ Sort data based on sortBy and order
  useEffect(() => {
    if (!data) return;
    const sorted = [...data].sort((a, b) => {
      let compareVal = 0;

      if (sortBy === "date") {
        compareVal =
          new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime();
      } else if (sortBy === "title") {
        compareVal = a.title!.localeCompare(b.title!);
      }

      return order === "asc" ? compareVal : -compareVal;
    });

    onChange(sorted);
  }, [data, sortBy, order, onChange]);


  return (

    <div className="ml-auto mb-6 text-xs bg-white px-3 py-2 w-fit flex flex-row items-center gap-2 rounded-md">
      <span className="text-muted-foreground font-medium">Sort by:</span>

      <Select
        value={sortBy}
        onValueChange={(val) => setSortBy(val as SortProps)}
      >
        <SelectTrigger className="font-medium text-inherit bg-muted shadow-none border-none w-[100px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="title">Title</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* Asc / Desc Toggle with Lucide icon */}
      <Tooltip delayDuration={700}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
          >
            <OrderIcon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          {`${order === "asc" ? "Ascending" : "Descending"}`}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

export default PostFilter;