"use client";
import { usePostServiceContext } from "@/context/postServiceContext";
import { slugifyName } from "@/lib/helper";
import { Button } from "../ui/button";
import ImageWithFallback from "../ui/imageWithFallback";
const ResourcesPage = ({cols = 4}:{cols?: 1 | 2 | 3 | 4 | 5;}) => {
  const { categories, allPosts } = usePostServiceContext();

    const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
  }[cols];

  const excluded = ['7dgG5942rH'] as string[]
  const filteredCategories = categories.filter(c => !excluded.includes(c.id))
  
  return (
    
      <div className={`grid ${gridCols} gap-6 pt-10`}>
        {filteredCategories.map(({ id, label, image_desktop }) => {
            const posts = allPosts.filter(p => p.category == id)
            const count = posts.length || 0
          return (
            <Button
              href={`/resources/${id}~${slugifyName(label)}`}
              key={id}
              className="border border-primary overflow-hidden shadow-xxs h-full bg-white rounded-3xl p-4 text-base flex-col items-start justify-start text-start"
              variant="ghost"
            >
              
              <ImageWithFallback
              className="!w-full rounded-lg !h-auto aspect-[296/193] object-cover object-[center_30%] block border-b border-gray-200"
              src={image_desktop}
              alt={label}
              />

              <span className="text-sm capitalize whitespace-normal">
                {label}
                <span className="block text-xs muted-text">{count} Resources</span>
              </span>
              <div className="mt-auto flex w-full justify-end items-center">
                <span className="block -mr-4 -mb-4 py-2 px-6 text-sm text-white bg-primary cursor-pointer">Explore</span>
              </div>
            </Button>
          );
        })}
      </div>
    
  );
};

export default ResourcesPage;
