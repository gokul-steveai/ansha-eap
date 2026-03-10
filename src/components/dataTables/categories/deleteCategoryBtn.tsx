"use client";

import Alert from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { deleteCategory } from "@/serverActions/crudCategories";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type DeleteItemButtonProps = {
    itemLabel?: string;
  itemId: string;
  itemName?: string;
  onDeleted?: () => void; // optional callback when delete succeeds
};

export default function DeleteItemButton({
    itemLabel,
  itemId,
  itemName,
  onDeleted,
}: DeleteItemButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    const result = await deleteCategory(itemId);

    if (result.success) {
      if (onDeleted) {
        onDeleted();
      } else {
        router.refresh(); // fallback if no custom handler
      }
    } else {
      toast.error(result.message || `Error deleting ${itemLabel}`);
    }
  };

  return (
    <Alert
      title={`Delete ${itemLabel}`}
      content={
        <>
          Are you sure you want to delete{" "}
          <span className="font-semibold">{itemName || `this ${itemLabel}`}</span>
          ? This action cannot be undone.
        </>
      }
      okText="Delete"
      cancelText="Cancel"
      trigger={
        <Button size="sm" className="text-red-400" variant="outline">
          Delete
        </Button>
      }
      onOk={handleDelete}
    />
  );
}
