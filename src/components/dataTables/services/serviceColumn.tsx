"use client";

import { Button } from "@/components/ui/button";
import { Service } from "@/serverActions/crudServices";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import DeleteItemButton from "./deleteServiceBtn";

export const ServiceColumns: ColumnDef<Service>[] = [

  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.original.image_url && (
          <Image
            src={row.original.image_url}
            alt={row.original.service_name}
            width={24}
            height={24}
            className="rounded-full"
          />
        )}
        <span>{row.original.service_name}</span>
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "booking_link",
    header: "Booking Link",
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => {
      const date = new Date(row.original.created_at);
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
                  <Button
                    href={`/admin/services/${item.id}`}
                    size="sm"
                    variant="outline"
                  >
                    Edit
                  </Button>
                  <DeleteItemButton
                    itemLabel="service"
                    itemId={item.id}
                    itemName={item.service_name}
                  />
                </div>
      );
    },
  },
];
