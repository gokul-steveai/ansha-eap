"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ImageWithFallback from "@/components/ui/imageWithFallback";
import { useAppServiceContext } from "@/context/appServiceContext";
import { cn } from "@/lib/utils";
import { CalendarCheck, ChevronDown, Heart, LogOut, TriangleAlert, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReportIssueDrawer from "../drawer/reportIssueDrawer";

type UserMenuProps = {
  triggerClassName?: string;
  hideIcon?: boolean
  imageClassName?: string;
  textClassName?: string;
  label?: string;
};

export function UserMenu({ label, textClassName, imageClassName, triggerClassName, hideIcon = false }: UserMenuProps) {
  const { currentUser } = useAppServiceContext();
  const [isMobile, setIsMobile] = useState(false);
  const [reportIssueOpen, setReportIssueOpen] = useState(false);
  const router = useRouter()
  const name = `${currentUser.first_name} ${currentUser.last_name}`

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
  }, [])

  return (
    <>
      <ReportIssueDrawer onOpenChange={setReportIssueOpen} isOpen={reportIssueOpen} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={cn("flex flex-row gap-2", triggerClassName)}
          >
            <ImageWithFallback
              className={cn("aspect-square rounded-full object-fit", imageClassName)}
              width={30}
              height={30}
              src={
                currentUser?.profile_img ?? "/assets/images/default-avatar.png"
              }
              alt=""
            />
            <div className={cn('space-y-[0.2em]', textClassName)}>
              <span>{label || name}</span>
            </div>
            <span className="sr-only">Toggle user menu</span>
            {!hideIcon && <ChevronDown className="h-3 w-3" />}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="z-[9999999]">
          <DropdownMenuItem asChild>
            <Link href="/settings/account" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/user/appointments" className="flex items-center gap-2">
              <CalendarCheck className="w-4 h-4" />
              My Appointments
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/user/favorites" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              My Favorites
            </Link>
          </DropdownMenuItem>
          {isMobile &&
            <DropdownMenuItem asChild
              onSelect={() => setReportIssueOpen(true)}>
              <span className="flex items-center gap-2">
                <TriangleAlert />
                Report Issue
              </span>
            </DropdownMenuItem>
          }

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => {
              router.push('/logout')
            }}
            className="flex items-center gap-2 text-red-600 focus:text-red-600"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>

      </DropdownMenu>
    </>
  );
}
