import { cn } from "@/lib/utils";
import { VideoOff } from "lucide-react";
import Image from "next/image";

type VideoProps = {
  src?: string;
  title: string;
  thumbnail?: string;
  className?: string;
};

const Video = ({ src, title, thumbnail, className }: VideoProps) => {
  const getEmbedUrl = () => {
    if (!src) return "";

    // YouTube detection
    const ytMatch = src.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

    // Vimeo detection
    const vimeoMatch = src.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

    return "";
  };

  const embedUrl = getEmbedUrl();

  return (
    <div
      className={cn(
        "bg-gray-200 rounded-xl overflow-hidden flex items-center justify-center",
        className
      )}
    >
      {embedUrl ? (
        <iframe
          src={embedUrl}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="w-full aspect-video"
        ></iframe>
      ) : src ? (
        <video src={src} controls className="w-full h-auto">
          <p>Sorry, the video can’t be played. {title}</p>
        </video>
      ) : thumbnail ? (
        <Image
          src={thumbnail}
          alt={`${title} thumbnail`}
          width={640}
          height={360}
          className="w-full h-auto object-cover"
          priority={false}
        />
      ) : (
        <div className="animate-pulse p-6 flex flex-col items-center justify-center w-full h-36 bg-gray-300 rounded-xl">
          <VideoOff size={48} className="mb-2 text-gray-400" />
          <span className="text-sm text-gray-500">No video available</span>
        </div>
      )}
    </div>
  );
};

export default Video;
