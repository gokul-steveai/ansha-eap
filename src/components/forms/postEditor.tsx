"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { slugifyName } from "@/lib/helper";
import {
  createPost,
  updatePost,
  getPostById,
  Post,
} from "@/serverActions/crudPosts";
import { usePathname } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { TiptapEditor } from "../ui/tiptap-editor";
import { usePostServiceContext } from "@/context/postServiceContext";
import { toast } from "sonner";

type PostEditorProps = {
  postId?: string;
};

export default function PostEditor({ postId }: PostEditorProps) {
  const {categories, setAllPosts} = usePostServiceContext()
  const pathName = usePathname();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Post>({
    defaultValues: {
      title: "",
      author: "",
      category: "",
      tags: "",
      video: "",
      audio: "",
      thumbnail: "",
      duration_hours: 0,
      duration_minutes: 0,
      description: "", // ✅ ensures description is initialized
    },
  });

  // Populate form if editing
  useEffect(() => {
    if (!postId) return;
    (async () => {
      try {
        const { data } = await getPostById(postId);
        if (data) {
          reset(data); // ✅ resets all fields, including description
        }
      } catch (error) {
        console.error("Failed to fetch post:", error);
      }
    })();
  }, [postId, reset]);

  const onSubmit = async (formData: Post) => {
    
    const slug = `${pathName.slice(0, -3)}${slugifyName(formData.title)}`;

    try {
      
      if (postId) {
        const {data} = await updatePost(postId, { ...formData, slug });
         if(!data) return
        setAllPosts((prev) =>
          prev.map((p) => (p.id === postId ? data : p))
        );
        reset(data);
        toast.success("Successfully updated", {
          description: data.title,
        });

      } else {
        const {data} = await createPost({ ...formData, slug });
        if(!data) return
        setAllPosts((prev) =>
          prev.map((p) => (p.id === postId ? data : p))
        );

        reset(data);

        toast.success("Successfully created", {
         description: data.title,
       });
      }
    } catch (error) {
       toast.error("Something went wrong");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title */}
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

      {/* Author */}
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

      {/* Category */}
      <div className="form-item">
        <label className="form-item-label">Category</label>
        <Controller
          name="category"
          control={control}
          rules={{ required: "Category is required" }}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.category && (
          <p className="text-red-500 text-sm">{errors.category.message}</p>
        )}
      </div>

      {/* Tags */}
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

      {/* Video link */}
      <div className="form-item">
        <label className="form-item-label">Video link</label>
        <Input placeholder="Video link" {...register("video")} />
      </div>

      {/* Audio link */}
      <div className="form-item">
        <label className="form-item-label">Audio link</label>
        <Input placeholder="Audio link" {...register("audio")} />
      </div>

      {/* Thumbnail */}
      <div className="form-item">
        <label className="form-item-label">Thumbnail</label>
        <Input placeholder="Thumbnail link" {...register("thumbnail")} />
      </div>

      {/* Duration */}
      <div className="form-item">
        <label className="form-item-label">Duration</label>
        <div className="flex gap-2">
          <div>
            <label className="label-inset">Hours</label>
            <Input
              type="number"
              min={0}
              {...register("duration_hours", { valueAsNumber: true })}
              placeholder="00"
              className="form-control w-30"
            />
          </div>
          <div>
            <label className="label-inset">Minutes</label>
            <Input
              type="number"
              min={0}
              max={59}
              {...register("duration_minutes", { valueAsNumber: true })}
              placeholder="00"
              className="form-control w-30"
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="form-item">
        <label className="form-item-label">Description</label>
        <Controller
          name="description"
          control={control}
          defaultValue="" // ✅ ensures initial value is set
          render={({ field }) => (
            <TiptapEditor value={field.value} onChange={field.onChange} />
          )}
        />
      </div>

      {/* Submit */}
      <Button className="float-right" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : postId ? "Update" : "Save"}
      </Button>
    </form>
  );
}
