"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useState } from "react";
import UploadcareGallery from "./UploadcareGallery";

type Props = {
  pubkey: string;
  onSelect: (url: string) => void;
  triggerClassName?:string;
  triggerText?:string;
};

export default function UploadcareGalleryDialog({ pubkey, onSelect, triggerClassName, triggerText = 'Select Image' }: Props) {
  const [open, setOpen] = useState(false);

  const handleSelect = (url: string) => {
    onSelect(url);
    setOpen(false); // close the dialog after selection
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>

        <Button
        onClick={() => setOpen(true)}
        variant="input"
        className={triggerClassName}
        >{triggerText}</Button>
    
      <DialogContent className="max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle>Gallery</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <UploadcareGallery pubkey={pubkey} onSelect={handleSelect} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
