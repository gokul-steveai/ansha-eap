"use client";
import { Button } from "@/components/ui/button";
import { usePostServiceContext } from "@/context/postServiceContext";
import { formatAsTime, truncateText } from "@/lib/helper";
import { ActionText } from "@/types";
import { Heart } from "lucide-react";
import ImageWithFallback from "./ui/imageWithFallback";
import { WeeklyBitesTableSkeleton } from "./weeklyBitesSkeleton";



const WeeklyBitesMobile = () => {

  
  const {latestPosts, generatePostLink} = usePostServiceContext()

  const data = latestPosts.sort((a, b) => new Date(b?.created_at ?? "").getTime() - new Date(a?.created_at ?? "").getTime())
  .slice(0,5)
  .map(i => {
    return {
      id: i.id ?? "",
      image: i.thumbnail ?? "",
      title: i.title ?? "",
      author: i.author ?? "",
      likes: 0,
      duration: formatAsTime(i.duration_hours,i.duration_minutes),
      action: "view" as ActionText,
      link: generatePostLink(i),
    }
  })
 

  return (
    <div>
      {data.length > 0 ? (
    <WeeklyBitesTable data={data} />
  ) : (
    <WeeklyBitesTableSkeleton rows={3} />
  )}
    </div>
  );
};


export default WeeklyBitesMobile;

type WeeklyBitesData = {
  id: string;
  image?:string;
  title: string;
  author: string;
  likes?:number;
  duration: string;
  action: ActionText;
  link: string;
}

function WeeklyBitesTable ({data}:{data:WeeklyBitesData[]}) {

  return <table className="w-full [&_td]:p-2 bordered-rows rounded-rows border-separate border-spacing-x-0 border-spacing-y-2">
  <tbody>
    { data.map(item => (
             <tr key={item.id} className="bg-white text-xs rounded-lg border border-muted">
              <td className="w-[80px]">
                <ImageWithFallback className="w-full rounded" width={50} height={32} alt={item.title} src={item.image}/>
              </td>
             <td className="align-middle text-start">
                 <div>
                     <p className="line-clamp-2">{truncateText(item.title,80)}</p>
                     <p className="line-clamp-1 text-xs text-muted-foreground">{item.author}</p>
                 </div>
             </td>
             <td className="align-middle w-[50px]">
                 <div className="flex flex-row gap-2 items-center">
                     <Heart className="w-[1em] h-[1em] fill-red-400/80 text-red-400/80"/>
                     <span className="text-xs text-muted-foreground ">{item.likes ?? 0}</span>
   
                 </div>
             </td>
             <td className="align-middle w-[80px]">
                     <Button href={item.link} className="h-fit w-full !px-2 !py-1 text-[1em]" variant="outline">
                         {item.action}
                     </Button>
             </td>
         </tr>
    ))}
 
  </tbody>
</table>

}