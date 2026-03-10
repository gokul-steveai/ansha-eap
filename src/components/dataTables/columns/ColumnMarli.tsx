"use client";

import { Marli } from "@/serverActions/crudMarli";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../../ui/button";
import DeleteItemButton from "../action-buttons/ButtonDeleteMarli";
import ImageWithFallback from "@/components/ui/imageWithFallback";

export const MarliColumns: ColumnDef<Marli>[] = [
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
      accessorKey: "time",
      header: "Time",
    },
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      accessorKey: "link",
      header: "Link",
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("date"));
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
        <Button href={`/admin/public-events/${item.id}`} size="sm" variant="outline">
          Edit
        </Button>
           <DeleteItemButton itemLabel="Public Event" itemId={item.id} itemName={item.title} />
      </div>
      );
    },
  },
];
