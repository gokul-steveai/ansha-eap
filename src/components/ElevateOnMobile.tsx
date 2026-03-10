import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

export default function ElevateOnMobile() {
    return (
        <Dialog>
            <DialogTrigger className="p-0">
                <Image
                    className="w-[150px] mx-auto"
                    width={200}
                    height={300}
                    alt="available on mobile"
                    src="/assets/images/mobileavailable.png" />
                <span className="text-xs text-muted-foreground">
                    Elevate is available on <span className="text-app-purple-300">Mobile</span>
                </span>
            </DialogTrigger>
            <DialogContent overlayClassName="bg-black/90" className="!max-w-[1200px] bg-transparent text-white border-none max-w-3xl">
                <DialogHeader className="flex justify-between items-center">
                    <DialogTitle className="text-xl">How to install app on mobile</DialogTitle>
                </DialogHeader>
                <div style={{ padding: "56.25% 0 0 0", position: "relative" }}>
                    <iframe
                        src="https://player.vimeo.com/video/1141590300?h=c885f9ded0&portrait=0&byline=0&title=0&autoplay=1&badge=0&vimeo_logo=0&controls=1"
                        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            borderRadius: "0.5rem",
                        }}
                        title="How to install app on mobile"
                    ></iframe>
                </div>
            </DialogContent>
        </Dialog>
    );
}