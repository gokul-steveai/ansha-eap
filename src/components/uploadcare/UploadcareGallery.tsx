"use client";

import { useEffect, useState } from "react";
import { FileUploaderRegular } from "@uploadcare/react-uploader/next";
import "@uploadcare/react-uploader/core.css";
import Image from "next/image";
import { getUploadcareImages } from "./serverAction/getUploadcareImages";
import { useGalleryContext } from "@/context/ImageGalleryContext";
import { ScrollArea } from "@radix-ui/react-scroll-area";

type UploadcareGalleryProps = {
  pubkey: string;
  onSelect: (url: string) => void;
};

export default function UploadcareGallery({ pubkey, onSelect }: UploadcareGalleryProps) {
  const {images, setImages} = useGalleryContext()
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const fetchImages = async () => {
    if (!pubkey) return;
    setLoading(true);
    try {
      const result = await getUploadcareImages({pubkey});
      setImages((prev) => [...prev, ...result.images]);
    } catch (err) {
      console.error("Error fetching Uploadcare images:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(images.length) return
    setImages([]);
    fetchImages();
  }, [pubkey]);

  return (
    <div className="space-y-4">
      <div className="flex w-full">
        <FileUploaderRegular
          className="ml-auto"
          pubkey={pubkey}
          multiple={false}
          accept="image/*"
          sourceList="local"
          useCloudImageEditor={false}
          classNameUploader="uc-light"
          onCommonUploadSuccess={(e) => {
            const cdnUrl = e.successEntries[0].cdnUrl;
            setImages((prev) => [cdnUrl, ...prev]);
            onSelect(cdnUrl);
          }}
        />
      </div>

      <div>
        {loading && images.length === 0 ? (
          <p className="text-gray-500">Loading images...</p>
        ) : images.length === 0 ? (
          <p className="text-gray-500">No images found.</p>
        ) : (
          <>
          <ScrollArea className="h-[600px] overflow-auto">
            <div className="bg-gray-200 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {images.map((url, index) => (
                <button
                  key={url + index}
                  onClick={() => {
                    setSelected(url);
                    onSelect(url);
                  }}
                  className={`!p-0 relative overflow-hidden border-2 transition ${
                    selected === url
                      ? "border-blue-500"
                      : "border-gray-300 hover:border-blue-500"
                  }`}
                >
                  <Image
                    src={url}
                    alt="Uploaded image"
                    width={150}
                    height={150}
                    className="object-cover w-full h-24"
                  />
                </button>
              ))}
            </div>
            </ScrollArea>
          </>
        )}
      </div>
    </div>
  );
}
