"use client";
import { usePostServiceContext } from "@/context/postServiceContext";
import { IconCourses, IconDocuments, IconGrid, IconMarli, IconPartners, IconServices } from "@/icons";
import { slugifyName } from "@/lib/helper";
import { NavItemsType } from "@/types";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

export function useNavItems(): NavItemsType[] {
  const { categories } = usePostServiceContext();

  const navItems: NavItemsType[] = [
    {
      title: "Dashboard",
      link: "/dashboard",
      icon: <IconGrid />,
    },
    {
      title: "Health Services",
      link: "/health-services",
      icon: <IconServices />,
    },
    {
      title: "Resources",
      link: "/resources",
      icon: <IconDocuments  strokeWidth={2.5}/>,
      subitems: categories
        .sort((a, b) => a.label.localeCompare(b.label))
        .map((i) => ({
          title: i.label,
          link: `/resources/${i.id}~${slugifyName(i.label)}`,
        })),
    },
    {
      title: "Short Courses",
      link: "/short-courses",
      icon: <IconCourses  strokeWidth={2.5}/>,
    },
    {
      title: "Partners",
      link: "/partners",
      icon: <IconPartners strokeWidth={2.5}/>,
    },
    {
      title: "Marli",
      link: "/marli",
      icon: <IconMarli className="px-[2px]" strokeWidth={1}/>,
    },
    // {
    //   title: "Critical Incident Response",
    //   link: "/critical-incident-response",
    //   icon: <IconCriticalResponse/>,
    // },
    // {
    //   title: "Admin",
    //   link: "/company-admin",
    //   icon: <IconAdmin strokeWidth={2.5}/>,
    // },
  ];
  return navItems;
}



export default function NavItems() {
  const pathname = usePathname();
  const navItems = useNavItems();
  return (
    <ul className="space-y-1">
      {navItems.map((navitem) => {
        const isActive = pathname === navitem.link;

        return (
          <React.Fragment key={navitem.title}>
            <Collapsible key={navitem.title}>

              <li
                key={navitem.title}
                className={`nav-item flex items-center ${isActive ? "active" : ""
                  }`}
              >
                <Link href={navitem.link}>
                  {navitem.icon && navitem.icon}
                  <span className="capitalize group-hover:underline decoration-[0.5px] underline-offset-[2px]">
                    {navitem.title}
                  </span>
                </Link>

                {navitem.subitems && (
                  <CollapsibleTrigger asChild>
                    <Button
                    className="ml-auto -mr-3"
                     size="icon" variant="ghost">
                      <ChevronRight className="collapsible-arrow h-4 w-4" />
                    </Button>
                  </CollapsibleTrigger>
                )}
              </li>

              <CollapsibleContent>
                {navitem.subitems && (
                  <ul className="submenu" key={navitem.title + "subitem"}>
                    {navitem.subitems.map((subitem) => {
                      const isActive = pathname === subitem.link;
                      return (
                        <li
                          key={subitem.title}
                          className={`nav-item ${isActive ? "active" : ""}`}
                        >
                          <Link href={subitem.link}>
                            {subitem.icon && subitem.icon}
                            <span className="capitalize">{subitem.title}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </CollapsibleContent>
            </Collapsible>
          </React.Fragment>
        );
      })}
    </ul>
  );
}
