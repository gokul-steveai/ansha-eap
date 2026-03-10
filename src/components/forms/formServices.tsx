"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check } from "lucide-react";
import { FileUploaderRegular } from "@uploadcare/react-uploader/next";
import "@uploadcare/react-uploader/core.css";
import Image from "next/image";
import { cn } from "@/lib/utils";

import {
  Service,
  createService,
  updateService,
} from "@/serverActions/crudServices";

type ServiceFormValues = {
  id?: string;
  image_url: string | null;
  service_name: string;
  description: string;
  booking_link: string;
};

export default function ServiceForm({
  service,
  className,
}: {
  service?: Service; // optional → create or update
  className?: string;
}) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    defaultValues: service
      ? {
          id: service.id,
          image_url: service.image_url,
          service_name: service.service_name,
          description: service.description,
          booking_link: service.booking_link,
        }
      : {
          image_url: null,
          service_name: "",
          description: "",
          booking_link: "",
        },
  });

  // Reset when switching between create/edit
  useEffect(() => {
    reset(
      service
        ? {
            id: service.id,
            image_url: service.image_url,
            service_name: service.service_name,
            description: service.description,
            booking_link: service.booking_link,
          }
        : {
            image_url: null,
            service_name: "",
            description: "",
            booking_link: "",
          }
    );
  }, [service, reset]);

  const imageUrl = watch("image_url");

  async function onSubmit(values: ServiceFormValues) {
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      let result;
      if (service) {
        // update mode
        result = await updateService(values.id!, values);
      } else {
        // create mode
        result = await createService(values);
      }

      if (!result.success) {
        setError(result.message);
        return;
      }

      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Unexpected error, please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("space-y-6", className)}
    >
      {/* Service Image */}
      <div className="form-item flex flex-col items-center gap-3">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt="Service Image"
            className="w-24 h-24 object-cover border rounded-md"
            width={96}
            height={96}
          />
        ) : (
          <div className="w-24 h-24 bg-gray-200 flex items-center justify-center text-sm text-gray-500 rounded-md border">
            No Image
          </div>
        )}
        <FileUploaderRegular
          useCloudImageEditor={false}
          sourceList="local"
          classNameUploader="uc-light"
          pubkey="927d7568bad196ef7d60"
          multiple={false}
          onCommonUploadSuccess={(e) => {
            const cdnUrl = e.successEntries[0].cdnUrl;
            setValue("image_url", cdnUrl, { shouldDirty: true });
          }}
        />
      </div>

      {/* Service Name */}
      <div className="space-y-2">
        <Label htmlFor="service_name">Service Name</Label>
        <Input
          id="service_name"
          {...register("service_name", { required: "Service name is required" })}
          placeholder="e.g. Physiotherapy"
        />
        {errors.service_name && (
          <p className="text-xs text-red-400">
            {errors.service_name.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows={4}
          {...register("description", {
            required: "Description is required",
            minLength: { value: 10, message: "At least 10 characters" },
          })}
          placeholder="Brief description of the service..."
        />
        {errors.description && (
          <p className="text-xs text-red-400">{errors.description.message}</p>
        )}
      </div>

      {/* Booking Link */}
      <div className="space-y-2">
        <Label htmlFor="booking_link">Booking Link</Label>
        <Input
          id="booking_link"
          type="url"
          {...register("booking_link", {
            pattern: {
              value:
                /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/,
              message: "Must be a valid URL",
            },
          })}
          placeholder="https://example.com/booking"
        />
        {errors.booking_link && (
          <p className="text-xs text-red-400">{errors.booking_link.message}</p>
        )}
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {success ? (
          <>
            <Check className="mr-2 h-4 w-4" /> Success
          </>
        ) : service ? (
          "Update Service"
        ) : (
          "Create Service"
        )}
      </Button>
    </form>
  );
}
