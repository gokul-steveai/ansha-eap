"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../../ui/button";
import ImageWithFallback from "@/components/ui/imageWithFallback";
import { ShortCourse } from "@/serverActions/crudShortCourses";
import DeleteItemButton from "../action-buttons/ButtonDeleteShortCourse";

export const ColumnShortCourse: ColumnDef<ShortCourse>[] = [
    {
          accessorKey: "image",
          header: "Image",
          cell: ({ row }) => {
            const image = row.original.image;
            return <ImageWithFallback src={image} alt="" className="!w-6 !h-6" />; // adjust size as needed
          },
        },
 {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    
    {
      accessorKey: "link",
      header: "Link",
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"));
        return <span>{date.toLocaleDateString()}</span>;
      },
    },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="space-x-2">
        <Button href={`/admin/short-courses/${item.id}`} size="sm" variant="outline">
          Edit
        </Button>
           <DeleteItemButton itemLabel="Short Course" itemId={item.id} itemName={item.title} />
      </div>
      );
    },
  },
];
