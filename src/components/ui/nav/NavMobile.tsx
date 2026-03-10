"use client";
import {
  IconDocuments,
  IconEmergency,
  IconGrid,
  IconServices,
} from "@/icons";
import { cn } from "@/lib/utils";
import { UserCog } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../dropdown-menu";
import { UserMenu } from "../userMenu";

const items = [
  { icon: IconGrid, label: "Dashboard", link: "/dashboard" },
  { icon: IconServices, label: "Services", link: "/health-services" },
  {
    icon: IconEmergency,
    label: "Emergency",
    iconClassName: 'fill-red-500',
    className: "",
    textClassName: "",
    link: "/critical-response",
  },
  { icon: IconDocuments, label: "Resources", link: "/resources", iconClassName: 'stroke-[3.5px]' },
  { icon: UserCog, label: "Account", link: "/settings/account" },
];
const NavMobile = () => {
  const path = usePathname();

  return (
    <div className="mobile-nav">
      <div className="grid grid-cols-5 gap-2">
        {items.map(({ icon: Icon, label, className, textClassName, link, iconClassName }) => {
          const activeClass = path == link && "text-primary [&_>_svg]:stroke-primary";
          if (label == "Account") {
            return (
              <UserMenu
                label={label}
                textClassName="text-[9px] text-[#888] font-[600]"
                imageClassName="!w-[24px] !h-[24px] block"
                hideIcon
                key={label}
                triggerClassName={`${className} ${activeClass} !p-2 text-zinc-400 rounded-xl text-base flex-col h-auto`}
              />
            );
          }
          if (label == 'Resources') {

            return <DropdownMenu key={label}>
              <DropdownMenuTrigger asChild>
                <Button
                  href={link}
                  key={label}
                  className={cn(
                    "!p-2 text-[#888] font-[600] rounded-xl text-base flex-col h-auto",
                    className,
                    activeClass
                  )}
                  variant="ghost"
                >

                  <Icon strokeWidth={1.2} className={cn("!w-[24px] !h-[24px] block", iconClassName)} />
                  <span className={cn("text-[9px]", textClassName)}>{label}</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="z-[9999999]">
                <DropdownMenuItem asChild>
                  <Link href="/resources" className="flex items-center gap-2">
                    ANSA Resources
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/short-courses" className="flex items-center gap-2">
                    Short Courses
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/partners" className="flex items-center gap-2">
                    Partners
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/marli" className="flex items-center gap-2">
                    Marli
                  </Link>
                </DropdownMenuItem>

              </DropdownMenuContent>

            </DropdownMenu>

          }

          return (
            <Button
              href={link}
              key={label}
              className={cn(
                "!p-2 text-[#888] font-[600] rounded-xl text-base flex-col h-auto",
                className,
                activeClass
              )}
              variant="ghost"
            >

              <Icon strokeWidth={1.2} className={cn("!w-[24px] !h-[24px] block", iconClassName)} />
              <span className={cn("text-[9px]", textClassName)}>{label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default NavMobile;
