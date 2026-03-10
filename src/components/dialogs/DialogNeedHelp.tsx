"use client"
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import FormSupport from "../forms/formSupport";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

type DialogNeedHelpProps = {
    hideTrigger?: boolean;
    onOpenChange?: ((open: boolean) => void);
    isOpen?: boolean;
    customTrigger?: ReactNode;
    triggerClassName?: string; hideOnMobile?: boolean
}
export default function DialogNeedHelp({
    hideTrigger,
    isOpen,
    onOpenChange,
    customTrigger,
    triggerClassName,
    hideOnMobile
}: DialogNeedHelpProps) {
    const [open, setOpen] = useState(isOpen);
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false)

    useEffect(() => {
        setMounted(true);

        const checkMobile = () => {
            if (!hideOnMobile) return
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();

        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        if (setOpen) {
            setOpen(isOpen)
        }
    }, [isOpen])

    if (!mounted || isMobile) return null;

    function handleOnOpenChange(v: boolean) {
        if (onOpenChange) {
            onOpenChange(v)
        }

        setOpen(v)

    }


    return (
        <Popover
            open={open} onOpenChange={handleOnOpenChange}>
            <PopoverTrigger asChild>

                {customTrigger ? customTrigger :

                    <Button
                        size="icon"
                        onClick={() => setOpen(!open)}
                        className={cn(
                            "z-[99999999] hover:scale-[1.2] transition hover:bg-[#0096F6] ring-1 ring-white p-3 h-fit rounded-full w-fit bg-[#0096FF] fixed bottom-5 right-5",
                            open && "scale-[1.2]",
                            triggerClassName && triggerClassName,
                            hideTrigger && "invisible pointer-events-none"
                        )}
                    >

                        {open ? <X strokeWidth={2} /> :
                            <span className="px-2">Need Help?</span>

                        }
                    </Button>
                }
            </PopoverTrigger>

            <PopoverContent
                onInteractOutside={(e) => {
                    e.preventDefault()
                }}
                className="-mb-7 rounded-3xl mr-10 max-w-screen w-[600px] dialog-report-issue">
                <div className="p-8 space-y-6 max-h-[80vh] overflow-auto">
                    {!isSuccess &&
                        <>
                            <h2 className="text-xl font-bold">Elevate Support</h2>
                            <p>
                                Requests are reviewed and handled in the order received by our support team to ensure issues are resolved clearly and correctly.
                            </p>
                        </>
                    }
                    <FormSupport onSuccessChange={setIsSuccess} />
                </div>
            </PopoverContent>
        </Popover>
    );
}