"use client"
import { ReactNode, useEffect, useRef, useState } from "react";
import FormSupport, { FormSupportHandle } from "../forms/formSupport";
import { Button } from "../ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "../ui/drawer";

type ReportIssueDrawerProps = {
    onOpenChange?: ((open: boolean) => void);
    isOpen?: boolean;
    customTrigger?: ReactNode;
}
export default function ReportIssueDrawer({
    isOpen,
    onOpenChange,
}: ReportIssueDrawerProps) {
    const formRef = useRef<FormSupportHandle>(null);
    const [open, setOpen] = useState(isOpen);
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    useEffect(() => {
        setMounted(true);
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
    }, []);

    useEffect(() => {
        if (setOpen) {
            setOpen(isOpen)
        }
    }, [isOpen])

        if (!mounted || !isMobile) return null;

    function handleOnOpenChange(v: boolean) {
        if (onOpenChange) {
            onOpenChange(v)
        }

        setOpen(v)

    }

    return (
        <Drawer
            open={open} onOpenChange={handleOnOpenChange}>

            <DrawerContent>
                <div className="p-8 space-y-6 overflow-auto">
                    <DrawerHeader className="p-0">
                        <DrawerTitle className="text-start">
                            {!isSuccess && "Elevate Support"}
                            </DrawerTitle>
                        <DrawerDescription className="text-start">{!isSuccess && "Requests are reviewed and handled in the order received by our support team to ensure issues are resolved clearly and correctly."}</DrawerDescription>
                    </DrawerHeader>

                    <FormSupport
                    ref={formRef}
                    hideSubmit
                    onSubmittingChange={(loading) => setIsSubmitting(loading)}
                    onSuccessChange={(success) => setIsSuccess(success)}
                    />

                </div>
                    <DrawerFooter>
                        <Button
                        isLoading={isSubmitting}
                            onClick={() => formRef.current?.submit()}
                        >Submit</Button>
                        <DrawerClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}