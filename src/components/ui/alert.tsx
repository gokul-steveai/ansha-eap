"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog";
import { Button } from "./button";

type CustomAlertDialogProps = {
  open?: boolean; // controlled open state
  onOpenChange?: (open: boolean) => void;
  title?: string;
  content?: string | React.ReactNode;
  showCancel?: boolean;
  showClose?: boolean;
  cancelText?: string;
  okText?: string;
  onCancel?: () => void;
  onOk?: () => void;
  trigger?: React.ReactNode; // optional trigger element
  className?:string;
};

export default function Alert({
  open,
  onOpenChange,
  title = "Alert",
  content = "",
  showCancel = true,
  showClose = false,
  cancelText = "Cancel",
  okText = "OK",
  onCancel,
  onOk,
  trigger,
  className,
}: CustomAlertDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}

      <AlertDialogContent className={className}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{content}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex gap-2">
          {showCancel && (
            <AlertDialogCancel asChild>
              <Button variant="outline" onClick={onCancel}>
                {cancelText}
              </Button>
            </AlertDialogCancel>
          )}

          <AlertDialogAction asChild>
            <Button onClick={onOk}>{okText}</Button>
          </AlertDialogAction>

          {showClose && (
            <Button
              variant="ghost"
              className="absolute top-2 right-2"
              onClick={() => onOpenChange?.(false)}
            >
              ✕
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
