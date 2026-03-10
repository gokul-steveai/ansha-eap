"use client";

import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createBlog, Blog } from "@/serverActions/crudBlogs";
import { slugifyName } from "@/lib/helper";
import { usePathname } from "next/navigation";
import { TiptapEditor } from "../ui/tiptap-editor";

export default function BlogAddNew() {
  const pathName = usePathname();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Blog>();

  const onSubmit = async (data: Blog) => {
    const slug = `${pathName.slice(0, -3)}${slugifyName(data.title)}`;

    try {
      await createBlog({ ...data, slug });
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="form-item">
        <label className="form-item-label">Title</label>
        <Input
          placeholder="Enter title"
          {...register("title", { required: "Title is required" })}
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}
      </div>

      <div className="form-item">
        <label className="form-item-label">Author</label>
        <Input
          placeholder="Author name"
          {...register("author", { required: "Author is required" })}
        />
        {errors.author && (
          <p className="text-red-500 text-sm">{errors.author.message}</p>
        )}
      </div>

      <div className="form-item">
        <label className="form-item-label">Tags</label>
        <Input
          placeholder="Comma-separated"
          {...register("tags", { required: "At least one tag is required" })}
        />
        {errors.tags && (
          <p className="text-red-500 text-sm">{errors.tags.message}</p>
        )}
      </div>

      <div className="form-item">
        <label className="form-item-label">Video link</label>
        <Input placeholder="Video link" {...register("video")} />
      </div>

      <div className="form-item">
        <label className="form-item-label">Audio link</label>
        <Input placeholder="Audio link" {...register("audio")} />
      </div>

      <div className="form-item">
        <label className="form-item-label">Thumbnail</label>
        <Input placeholder="Thumbnail link" {...register("thumbnail")} />
      </div>
      <div className="form-item">
        <label className="form-item-label">Duration</label>
        <div className="flex gap-2">
          <div>
            <label htmlFor="" className="label-inset">
              Hours
            </label>
            <Input
              type="number"
              min={0}
              defaultValue={0}
              {...register("duration_hours", { valueAsNumber: true })}
              placeholder="00"
              className="form-control w-30"
            />
          </div>

          <div>
            <label htmlFor="" className="label-inset">
              Minutes
            </label>
            <Input
              type="number"
              min={0}
              max={59}
              defaultValue={0}
              {...register("duration_minutes", { valueAsNumber: true })}
              placeholder="00"
              className="form-control w-30"
            />
          </div>
        </div>
      </div>


      <div className="form-item">
        <label className="form-item-label">Description</label>
        <Controller
          name="description"
          control={control} // from useForm
          render={({ field }) => (
            <TiptapEditor value={field.value ?? ""} onChange={field.onChange} />
          )}
        />
      </div>

      <Button className="float-right" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
