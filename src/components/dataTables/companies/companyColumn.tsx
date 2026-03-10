"use client";

import { Company } from "@/serverActions/crudCompanies";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Button } from "../../ui/button";
import { CopyButton } from "../../ui/copyButton";
import DeleteItemButton from "./deleteCompanyBtn";

type CompanyWithMembers = Company & {
  member_count?: number;
}

export const CompanyColumns: ColumnDef<CompanyWithMembers>[] = [
  {
    accessorKey: "code",
    header: "Company Code",
    cell: ({ row }) => {
      const code = row.getValue("code") as string;
      return <CopyButton label={code} value={code} />;
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.original.logo_url && (
          <Image
            src={row.original.logo_url}
            alt={row.original.name}
            width={24}
            height={24}
            className="rounded-full"
          />
        )}
        <span>{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "practitioners",
    header: "Practitioners",
    cell: ({row})=> {


      return <span>{row.original.practitioners.join(", ")}</span>
    }
  },
  {
    accessorKey: "locations",
    header: "Locations",
    cell: ({row})=> {
      return <span>{row.original.locations.join(", ")}</span>
    }
  },
  {
    accessorKey: "max_users",
    header: "Members",
    cell: ({row})=> {
      const max = row.original.max_users
      const total = row.original.member_count ?? 0

      return <span>{total} / {max}</span>
    }
  },
  {
    accessorKey: "max_booking_credits_per_user",
    header: "Max Booking Credits/User",
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
    accessorKey: "updated_at",
    header: "Updated",
    cell: ({ row }) => {
      const date = new Date(row.original.updated_at);
      return <span>{date.toLocaleDateString()}</span>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const company = row.original;
      return (
        <div className="space-x-2">
        <Button href={`/admin/companies/${company.id}`} size="sm" variant="outline">
          Edit
        </Button>
           <DeleteItemButton itemLabel="company" itemId={company.id} itemName={company.name} />
      </div>
      );
    },
  },
];
