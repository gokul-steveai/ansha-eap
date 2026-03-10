import { cn } from "@/lib/utils";
import { Music2, Pause, Play, RotateCcw, RotateCw } from "lucide-react";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { Button } from "./button";

type AudioProps = {
  src?: string;
  title: string;
  className?: string;
  thumbnail?: string;
  size?: "small" | "default";
};

const formatTime = (time: number) => {
  if (isNaN(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const Audio = ({
  src,
  title,
  className,
  thumbnail,
  size = "default",
}: AudioProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setProgress(audioRef.current.currentTime);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const newTime = parseFloat(e.target.value);
    audioRef.current.currentTime = newTime;
    setProgress(newTime);
  };

    // ⏪ rewind 10s
    const rewind10 = () => {
        if (!audioRef.current) return;
        const newTime = Math.max(audioRef.current.currentTime - 10, 0);
        audioRef.current.currentTime = newTime;
        setProgress(newTime);
      };
    
      // ⏩ forward 10s
      const forward10 = () => {
        if (!audioRef.current) return;
        const newTime = Math.min(
          audioRef.current.currentTime + 10,
          duration
        );
        audioRef.current.currentTime = newTime;
        setProgress(newTime);
      };


  const updateBuffered = () => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    if (audio.buffered.length > 0) {
      setBuffered(audio.buffered.end(audio.buffered.length - 1));
    }
  };

  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    const updateDuration = () => setDuration(audio.duration || 0);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("progress", updateBuffered);
    return () => {
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("progress", updateBuffered);
    };
  }, []);

  if (!src) {
    return (
      <div className="animate-pulse flex items-center gap-3 w-full">
        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
          <Music2 className="text-gray-400" />
        </div>
        <span className="text-sm text-gray-500">No audio available</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-white rounded-xl w-full rounded-lg overflow-hidden p-4",
        className
      )}
    >
      {/* === DEFAULT PLAYER === */}
      {size === "default" && (
   <div
   className={cn(
     "flex gap-4 items-center w-full flex-col relative audio-player group",
     !isPlaying && "always-show"
   )}
 >
   {thumbnail ? (
     <Image
       src={thumbnail}
       alt={`${title} thumbnail`}
       width={640}
       height={360}
       className="w-auto h-auto object-cover rounded-lg"
       priority={false}
     />
   ) : (
     <Music2 className="text-gray-400 w-8 h-8" />
   )}
 
   {/* Overlay */}
   <div
     className={cn("w-full")}
   >
     <p className="truncate font-medium text-gray-800 text-center mb-4">{title}</p>
 
     <div className="mt-auto flex gap-3 w-full flex-col">
        <div>
        <div className="relative w-full h-2 rounded-full bg-gray-300 overflow-hidden">
         {/* Buffered bar */}
         <div
           className="absolute top-0 left-0 h-full bg-gray-400"
           style={{
             width: duration ? `${(buffered / duration) * 100}%` : "0%",
           }}
         />
         {/* Progress bar */}
         <div
           className="absolute top-0 left-0 h-full bg-primary"
           style={{
             width: duration ? `${(progress / duration) * 100}%` : "0%",
           }}
         />
         {/* Slider input */}
         <input
           type="range"
           min={0}
           max={duration || 0}
           value={progress}
           step="0.1"
           onChange={handleSeek}
           className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
         />
       </div>
       <div className="flex flex-1 flex-row justify-between">
       <span className="text-xs text-muted-foreground whitespace-nowrap">
           {formatTime(progress)}
         </span>
       <span className="text-xs text-muted-foreground whitespace-nowrap">
       {formatTime(duration)}
         </span>

       </div>
        </div>
    
       <div className="text-white flex items-center gap-2 justify-center">
           <Button
            onClick={rewind10}
            variant={"ghost"}
            className="rounded-full !p-0 relative text-foreground"
            size={"icon"}>
            <RotateCcw className="size-" size="2em" strokeWidth={1.2}/>
            <span className="absolute text-[.55em]">
                10s
            </span>
           </Button>
         <Button
           onClick={togglePlay}
           className="rounded-full h-fit aspect-square"
         >
           {isPlaying ? (
             <Pause className="size-" size="2em" fill="white" stroke="white" />
           ) : (
             <Play className="size-" size="2em"  fill="white" stroke="white" />
           )}
         </Button>
         <Button
         onClick={forward10}
         variant={"ghost"}
         className="rounded-full !p-0 relative text-foreground"
         size={"icon"}
         >
            <RotateCw className="size-" size="2em" strokeWidth={1.2}/>
            <span className="absolute text-[.55em]">
                10s
            </span>
           </Button>
       </div>
     </div>
   </div>
 </div>
 
      )}

      {/* === SMALL PLAYER === */}
      {size === "small" && (
        <div className="flex gap-4 items-center w-full flex-row">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
            {thumbnail ? (
              <Image
                src={thumbnail}
                alt={`${title} thumbnail`}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            ) : (
              <Music2 className="text-gray-400 w-8 h-8" />
            )}
          </div>

          <div className="flex-1 w-full flex flex-col justify-between min-w-0">
            <p className="truncate font-medium text-gray-800">{title}</p>

            <div className="flex items-center gap-3 mt-2 w-full">
              <button
                onClick={togglePlay}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white hover:opacity-90 transition"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>

              <div className="flex items-center gap-2 w-full">
                <span className="text-xs text-gray-600 whitespace-nowrap">
                  {formatTime(progress)}
                </span>

                <div className="relative w-full h-2 rounded-full bg-gray-300 overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-gray-400"
                    style={{
                      width: duration ? `${(buffered / duration) * 100}%` : "0%",
                    }}
                  />
                  <div
                    className="absolute top-0 left-0 h-full bg-primary"
                    style={{
                      width: duration ? `${(progress / duration) * 100}%` : "0%",
                    }}
                  />
                  <input
                    type="range"
                    min={0}
                    max={duration || 0}
                    value={progress}
                    step="0.1"
                    onChange={handleSeek}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>

                <span className="text-xs text-gray-600 whitespace-nowrap">
                  {formatTime(duration)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <audio
        ref={audioRef}
        src={src}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        preload="metadata"
      />
    </div>
  );
};

export default Audio;
