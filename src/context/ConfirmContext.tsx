"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"

type ConfirmOptions = {
  title?: string
  description?: ReactNode
  okText?: string
  cancelText?: string
}

type ConfirmContextType = {
  confirm: (options: ConfirmOptions) => Promise<boolean>
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined)

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<ConfirmOptions>({})
  const [resolver, setResolver] = useState<(value: boolean) => void>()

  const confirm = (opts: ConfirmOptions) => {
    setOptions(opts)
    setOpen(true)
    return new Promise<boolean>((resolve) => {
      setResolver(() => resolve)
    })
  }

  const handleConfirm = () => {
    setOpen(false)
    resolver?.(true)
  }

  const handleCancel = () => {
    setOpen(false)
    resolver?.(false)
  }

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{options.title || "Are you sure?"}</AlertDialogTitle>
            <AlertDialogDescription>
              {options.description || "This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>
              {options.cancelText || "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              {options.okText || "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ConfirmContext.Provider>
  )
}

export function useConfirmDialog() {
  const ctx = useContext(ConfirmContext)
  if (!ctx) throw new Error("useConfirmDialog must be used within a ConfirmProvider")
  return ctx.confirm
}
