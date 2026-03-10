"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import DeleteItemButton from "./deleteCategoryBtn";
import { Category } from "@/serverActions/crudCategories";
import * as Icons from "@/icons";
import ImageWithFallback from "@/components/ui/imageWithFallback";

export function useCategoryColumns(): ColumnDef<Category>[] {
  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: "image_desktop",
      header: "Image Desktop",
      cell: ({ row }) => {
        const image = row.original.image_desktop;
        return <ImageWithFallback src={image} alt="" className="!w-6 !h-6" />; // adjust size as needed
      },
    },
    {
      accessorKey: "image_mobile",
      header: "Image Mobile",
      cell: ({ row }) => {
        const image = row.original.image_mobile;
        return <ImageWithFallback src={image} alt="" className="!w-6 !h-6" />; // adjust size as needed
      },
    },
    {
      accessorKey: "icon",
      header: "Icon",
      cell: ({ row }) => {
        const iconKey = row.original.icon;
        if (!iconKey) return null;

        const Icon = Icons[iconKey as keyof typeof Icons] as
          | Icons.IconComponent
          | undefined;
        if (!Icon) return null;

        return <Icon className="!w-6 !h-6" />; // adjust size as needed
      },
    },
    {
      accessorKey: "label",
      header: "Label",
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "tags",
      header: "Tags",
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
            <Button
              href={`/admin/categories/${item.id}`}
              size="sm"
              variant="outline"
            >
              Edit
            </Button>
            <DeleteItemButton
              itemLabel="category"
              itemId={item.id}
              itemName={item.label}
            />
          </div>
        );
      },
    },
  ];

  return columns;
}
