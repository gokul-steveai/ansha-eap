import { formatAsTime, htmlToPlainText, slugifyName, truncateText } from "@/lib/helper";
import { cn } from "@/lib/utils";
import { Post } from "@/serverActions/crudPosts";
import { ActionText } from "@/types";
import { Clock } from "lucide-react";
import { Button } from "../ui/button";
import ImageWithFallback from "../ui/imageWithFallback";
import { usePostServiceContext } from "@/context/postServiceContext";

const PostCard = ({ item, actionText = "read", className }: { item: Post, actionText?: ActionText, className?: string; }) => {
  const {categories} = usePostServiceContext()
  return (
    <div className={cn("card rounded-lg p-4 w-1/4 min-w-[280px] w-full flex flex-col gap-5 text-sm", className)}>
      
        <ImageWithFallback
          className="img rounded-sm w-full h-[167px] object-cover object-top"
          width={200}
          height={100}
          src={item.thumbnail}
          alt={item.title || ""}
        />
      

      <p className="text-base font-medium">{item.title}</p>

      <p className="text-body line-clamp-3 text-muted-foreground text-xs whitespace-pre-wrap">
        {item.description &&
          truncateText(htmlToPlainText(item.description), 200)}
      </p>


      <div className="flex mt-auto">
        <div className="flex flex-row items-center gap-2">
          <Clock width="1em" className="text-app-purple-300 text-base" />
          <span className="text-muted-foreground">
            {formatAsTime(item.duration_hours,item.duration_minutes)}
          </span>
        </div>
        <Button className="ml-auto capitalize" variant="outline" href={`/resources/${item.category}~${slugifyName(categories.find(c => c.id == item.category)?.label ?? "")}/${item.id}~${slugifyName(item.title)}`}>
          {actionText}
        </Button>
      </div>
    </div>
  );
};

export default PostCard;
