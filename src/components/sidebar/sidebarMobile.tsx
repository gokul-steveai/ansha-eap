"use client";
import {
  IconCalendar,
  IconContents,
  IconEmergency,
  IconLogo,
  IconPublicSession,
  IconServices
} from "@/icons";
import { cn } from "@/lib/utils";
import { House, UserCog } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "../ui/drawer";
import { UserMenu } from "../ui/userMenu";

const items = [
  { icon: House, label: "Home", link: "/dashboard" },
    { icon: IconServices, label: "Services", link: "/health-services" },
  { icon: IconCalendar, label: "Appointments", link: "/user/appointments" },
  {
    icon: IconEmergency,
    label: "Emergency",
    className: "bg-red-500",
    textClassName: "text-white",
    link: "/critical-response",
  },
  { icon: IconPublicSession, label: "Public Session", link: "/public-events" },
  { icon: IconContents, label: "Contents", link: "/resources" },
  { icon: UserCog, label: "Account", link: "/settings/account" },
];
const SidebarMobile = () => {
  return <DrawerStyle />;
};

export default SidebarMobile;

function DrawerStyle() {
  const path = usePathname()
  return (
    <>
      <Drawer>
        <DrawerTrigger className="z-[99999] overflow-hidden flex flex-col items-center p-5 rounded-full border-2 border-white shadow-lg bg-primary fixed bottom-2 right-2 min-w-[80px] w-[80px] h-[80px] max-h-[80px] p-3 bg-linear-330 from-60% to-100% from-primary to-white">
          <IconLogo fill="white" height={45} width={45} />
          <p className="mt-[2px] text-[8px] font-medium text-white">Menu</p>
        </DrawerTrigger>
        <DrawerContent className="z-[999999]">
          <DrawerTitle className="sr-only">menu</DrawerTitle>
          <div className="grid grid-cols-4 gap-3 p-4">
            {items.map(
              ({ icon: Icon, label, className, textClassName, link }) => {
                const isActive = path == link && "!text-white bg-primary"
                if(label == "Account"){
                  return <UserMenu textClassName="text-[8px]" imageClassName="!w-[32px] !h-[32px] block" hideIcon key={label} triggerClassName={`${className} ${isActive} text-zinc-400 rounded-xl p-2 text-base border-1 border-current/40 flex-col aspect-square h-auto`}/>
                }
                return (
                  <Button
                    href={link}
                    key={label}
                    className={cn(
                      "text-zinc-400 rounded-xl p-2 text-base border-1 border-current/40 flex-col aspect-square h-auto",
                      className, isActive
                    )}
                    variant="ghost"
                  >
                    <Icon
                      strokeWidth={1.2}
                      className="!w-[32px] !h-[32px] block"
                    />
                    <span className={cn("text-[8px]", textClassName)}>
                      {label}
                    </span>
                  </Button>
                );
              }
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
