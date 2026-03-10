"use client";

import { Practitioner } from "@/serverActions/crudPractitioners";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

import { htmlToPlainText, truncateText } from "@/lib/helper";
import { Button } from "@/components/ui/button";
import DeleteItemButton from "./deletePractitionerBtn";

export const PractitionerColumn: ColumnDef<Practitioner>[] = [
    {
    accessorKey: "halaxy_id",
    header: "Halaxy Id",
  },
  {
    accessorKey: "profile_img",
    header: "Profile",
    cell: ({ row }) =>
      row.original.profile_img ? (
        <Image
          src={row.original.profile_img}
          alt={`${row.original.first_name} ${row.original.last_name}`}
          width={40}
          height={40}
          className="rounded-full aspect-square object-cover object-top"
        />
      ) : (
        <span>-</span>
      ),
  },
  {
    accessorKey: "first_name",
    header: "First Name",
  },
  {
    accessorKey: "last_name",
    header: "Last Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      return (
        <span>
          {truncateText(htmlToPlainText(row.original.description || ""), 30)}
        </span>
      );
    },
  },
  {
    accessorKey: "profession",
    header: "Profession",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "clinic",
    header: "Clinic",
  },
  {
    accessorKey: "booking_link",
    header: "Booking Link",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "expertise",
    header: "Expertise",
    cell: ({ row }) =>
      row.original.expertise?.length ? row.original.expertise.join(", ") : "-",
  },
  {
    accessorKey: "languages",
    header: "Languages",
    cell: ({ row }) =>
      row.original.languages?.length ? row.original.languages.join(", ") : "-",
  },
  {
    accessorKey: "modalities",
    header: "Modalities",
    cell: ({ row }) =>
      row.original.modalities?.length
        ? row.original.modalities.join(", ")
        : "-",
  },
  {
    accessorKey: "patient_focus",
    header: "Patient Focus",
    cell: ({ row }) =>
      row.original.patient_focus?.length
        ? row.original.patient_focus.join(", ")
        : "-",
  },
  {
    accessorKey: "services",
    header: "Services",
    cell: ({ row }) =>
      row.original.services?.length ? row.original.services.join(", ") : "-",
  },
  {
    accessorKey: "qualifications",
    header: "Qualifications",
    cell: ({ row }) =>
      row.original.qualifications?.length
        ? row.original.qualifications.join(", ")
        : "-",
  },
  {
    accessorKey: "accreditations",
    header: "Accreditations",
    cell: ({ row }) =>
      row.original.accreditations?.length
        ? row.original.accreditations.join(", ")
        : "-",
  },
  {
    accessorKey: "certifications",
    header: "Certifications",
    cell: ({ row }) =>
      row.original.certifications?.length
        ? row.original.certifications.join(", ")
        : "-",
  },
  {
    accessorKey: "other_services",
    header: "Other Services",
    cell: ({ row }) =>
      row.original.other_services?.length
        ? row.original.other_services.join(", ")
        : "-",
  },
  {
    accessorKey: "registrations",
    header: "Registrations",
    cell: ({ row }) =>
      row.original.registrations?.length
        ? row.original.registrations
            .map((r) => `${r.name}: ${r.value}`)
            .join(", ")
        : "-",
  },
  {
    accessorKey: "identifications",
    header: "Identifications",
    cell: ({ row }) =>
      row.original.identifications?.length
        ? row.original.identifications
            .map((i) => `${i.name}: ${i.value}`)
            .join(", ")
        : "-",
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
  },
  {
    accessorKey: "updated_at",
    header: "Updated",
    cell: ({ row }) => new Date(row.original.updated_at).toLocaleDateString(),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="space-x-2">
          <Button
            href={`/admin/practitioners/${item.id}`}
            size="sm"
            variant="outline"
          >
            Edit
          </Button>
          <DeleteItemButton
            itemLabel="practitioner"
            itemId={item.id}
            itemName={item.first_name}
          />
        </div>
      );
    },
  },
];
