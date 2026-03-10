"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

import { usePostServiceContext } from "@/context/postServiceContext";
import {
  createFeaturedContent,
  FeaturedContent,
  updateFeaturedContent,
} from "@/serverActions/crudFeaturedContent";
import MultiSelect from "../multiSelect";
import { Badge } from "../ui/badge";
import { MultiSelectOption } from "@/types";

type FeaturedContentFormValues = {
  id?: string; // optional, for update
  ids: string[]; // post IDs to feature
  type: string; // type of feature (banner, highlight, etc.)
};

export default function FeaturedContentForm({
  defaultValues,
  editMode = false,
  header,
}: {
  defaultValues?: FeaturedContent;
  editMode?: boolean;
  header?:string;
}) {
  const { allPosts } = usePostServiceContext();
  const [success, setSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(!editMode);
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<FeaturedContentFormValues>({
    defaultValues: {
      id: defaultValues?.id,
      ids: defaultValues?.ids || [],
      type: defaultValues?.type || "banner",
    },
  });

  async function onSubmit(data: FeaturedContentFormValues) {
    try {
      const result = data.id
        ? await updateFeaturedContent(data.id, data)
        : await createFeaturedContent(data);

      if (result.success) {
        setSuccess(true);
      } else {
        console.error("❌ Error", result.message);
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Convert posts → options
  const postOptions: MultiSelectOption[] = allPosts.map((post) => ({
    value: post.id,
    label: post.title,
  }));

  return (
    <div className="flex flex-col group">
        <div className="flex space-between items-center mb-4">
        {header && <h2 className="card-title">{header}</h2>}
      {editMode && !isEditing ?
        <Button 
        className="group-hover:visible invisible ml-auto text-muted-foreground hover:text-app-purple-300"
        variant="link" onClick={() => setIsEditing(true)}>Edit</Button>
        : 
         <Button 
        className="ml-auto text-muted-foreground hover:text-app-purple-300"
        variant="link"
        onClick={() => setIsEditing(false)}>Back</Button>
      }
      </div>

     {isEditing && 
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Multi-select for Posts */}
        <div className="space-y-2">
          {/* <label className="text-sm font-medium">Select Posts</label> */}
          <Controller
            name="ids"
            control={control}
            render={({ field }) => (
              <MultiSelect
                placeholder="Select posts"
                options={postOptions}
                value={postOptions.filter((opt) =>
                  field.value.includes(opt.value)
                )}
                onChange={(selected) =>
                  field.onChange(selected.map((opt: MultiSelectOption) => opt.value))
                }
              />
            )}
          />
        </div>

        {/* Type */}
        {!defaultValues?.id && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Type</label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  className="w-full rounded border px-2 py-1"
                  placeholder="banner / highlight"
                />
              )}
            />
          </div>
        )}

       <div className="flex flex-nowrap justify-end w-[300px] gap-2 ml-auto">
          <Button type="submit" disabled={isSubmitting} className="w-1/2">
            {success ? (
              <>
                <Check className="mr-2 h-4 w-4" /> Success
              </>
            ) : defaultValues?.id ? (
              "Update"
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </form>
      }

      {!isEditing && <>
        <div className="flex gap-2 flex-wrap">
            {allPosts && defaultValues && defaultValues?.ids?.length > 0 && defaultValues.ids.map(i => {
                return <Badge
                className="p-3"
                 variant="secondary" key={i}>{allPosts.find(p => p.id == i)?.title}</Badge>
                })}
        </div>
      
      </>

      }
    </div>
  );
}
