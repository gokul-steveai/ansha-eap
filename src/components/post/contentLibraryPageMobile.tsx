"use client";
import { usePostServiceContext } from "@/context/postServiceContext";
import * as Icons from "@/icons";
import { slugifyName } from "@/lib/helper";
import { Button } from "../ui/button";
import ImageWithFallback from "../ui/imageWithFallback";
const ContentLibraryPageMobile = ({cols = 3}:{cols?: 1 | 2 | 3 | 4 | 5;}) => {
  const { categories } = usePostServiceContext();

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
    
      <div className={`grid ${gridCols} gap-4 pt-10`}>
        {filteredCategories.map(({ id, label, icon, image_mobile }) => {
          const Icon = Icons[icon as keyof typeof Icons] as
            | Icons.IconComponent
            | undefined;
          return (
            <Button
              href={`/resources/${id}~${slugifyName(label)}`}
              key={id}
              className="shadow-xxs bg-white rounded-xl p-2 text-base flex-col aspect-square h-auto"
              variant="ghost"
            >
              {/* ✅ Only render Icon if it exists */}
              {image_mobile &&
              <ImageWithFallback
              className="w-[40px] h-[40px] block border-b border-gray-200"
              src={image_mobile}
              alt={label}
              width={40}
              height={40}
              />

              }
              {!image_mobile && Icon && (
                <Icon className="text-primary w-[40px] h-[40px] block" />
              )}

              <span className="text-[10px] capitalize whitespace-normal">
                {label}
              </span>
            </Button>
          );
        })}
      </div>
    
  );
};

export default ContentLibraryPageMobile;
