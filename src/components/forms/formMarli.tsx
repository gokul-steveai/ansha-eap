"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    createMarli,
    Marli,
    updateMarli,
} from "@/serverActions/crudMarli";
import "@uploadcare/react-uploader/core.css";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { DatePicker } from "../ui/datePicker";
import ImageWithFallback from "../ui/imageWithFallback";
import UploadcareGalleryDialog from "../uploadcare/UploacareGalleryDialog";

type MarliFormProps = {
    data?: Marli;
    onSubmitSuccess?: (data: Marli) => void;
    hideSubmitButton?: boolean;
    submitForm?: (submitFn: () => void) => void;
};

export default function Form_Marli({
    data,
    onSubmitSuccess,
    hideSubmitButton = false,
    submitForm,
}: MarliFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        watch,
        control,
    } = useForm<Marli>({
        defaultValues: {
            title: data?.title || "",
            description: data?.description || "",
            time: data?.time || "",
            location: data?.location || "",
            image: data?.image || "",
            link: data?.link || "",
            date: data?.date || undefined, // date field
        },
    });

    const image = watch("image");

    const onSubmit = async (data: Marli) => {
        try {
            let result;
            if (data?.id) {
                result = await updateMarli(data.id, data);
            } else {
                result = await createMarli(data);
            }
            if (result.success && result.data) {
                onSubmitSuccess?.(result.data);
                if (data?.id) {
                    reset(result.data);
                } else {
                    reset();
                }
            }
        } catch (error) {
            console.log(error);
            reset();
        }
    };

    // Expose submit function externally
    useEffect(() => {
        if (submitForm) {
            submitForm(() => handleSubmit(onSubmit));
        }
    }, [submitForm, handleSubmit]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Image Preview */}
                <div className="form-item w-fit">
        <label className="form-item-label">Image</label>
                <ImageWithFallback
                    src={image}
                    alt="Event"
                    className="w-[150px] h-[150px] rounded object-cover border"
                    width={150}
                    height={150}
                />


                <Controller
                    name="image"
                    control={control}
                    render={({ field }) => (
                        <UploadcareGalleryDialog
                            pubkey="927d7568bad196ef7d60"
                            onSelect={(url) => field.onChange(url)}
                        />
                    )}
                />
            </div>

            {/* Title */}
            <div className="form-item">
                <label className="form-item-label">Title</label>
                <Input
                    placeholder="Title"
                    {...register("title", { required: "Title is required" })}
                />
                {errors.title && (
                    <p className="text-red-500 text-sm">{errors.title.message}</p>
                )}
            </div>

            {/* Description */}
            <div className="form-item">
                <label className="form-item-label">Short Description</label>
                <Input
                    placeholder="Short description"
                    {...register("description", { required: "Description is required" })}
                />
                {errors.description && (
                    <p className="text-red-500 text-sm">{errors.description.message}</p>
                )}
            </div>

            {/* Date */}
            <div className="form-item">
                <label className="form-item-label">Date</label>
                <Controller
                    control={control}
                    name="date"
                    rules={{ required: "Date is required" }}
                    render={({ field }) => (
                        <DatePicker
                            value={field.value ? new Date(field.value) : undefined}
                            onChange={field.onChange}
                            className="w-full"
                        />
                    )}
                />
                {errors.date && (
                    <p className="text-red-500 text-sm">{errors.date.message}</p>
                )}
            </div>

            {/* Time */}
            <div className="form-item">
                <label className="form-item-label">Time</label>
                <Input
                    placeholder="11:00am - 1:00pm"
                    {...register("time", { required: "Time is required" })}
                />
                {errors.time && (
                    <p className="text-red-500 text-sm">{errors.time.message}</p>
                )}
            </div>

            {/* Location */}
            <div className="form-item">
                <label className="form-item-label">Location</label>
                <Input
                    placeholder="Event location"
                    {...register("location", { required: "Location is required" })}
                />
                {errors.location && (
                    <p className="text-red-500 text-sm">{errors.location.message}</p>
                )}
            </div>

            {/* Link */}
            <div className="form-item">
                <label className="form-item-label">Link</label>
                <Input
                    placeholder="Event link"
                    {...register("link", { required: "Link is required" })}
                />
                {errors.link && (
                    <p className="text-red-500 text-sm">{errors.link.message}</p>
                )}
            </div>

            {!hideSubmitButton && (
                <Button className="float-right" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save"}
                </Button>
            )}
        </form>
    );
}
