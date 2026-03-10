"use client";

import { useInbox } from "@/context/InboxContext";
import { usePushNotifications } from "@/context/PushNotificationContext";
import { Bell, BellOff } from "lucide-react";
import { Button } from "./button";
import Link from "next/link";

export default function InboxRouter() {
  const { inboxItems, loading } = useInbox();
  const { isSubscribed } = usePushNotifications();

  const unreadCount = inboxItems.filter(i => i.status === "unread").length;

  return (
    <Button className="relative rounded-full" variant="ghost" size="icon" asChild>
      <Link href="/inbox">
        {isSubscribed ? <Bell className="!w-5 !h-5 text-gray-700" /> : <BellOff className="!w-5 !h-5 text-gray-700" />}
        {!loading && unreadCount > 0 && (
          <span className="absolute line-height-0 top-[4px] md:top-0 right-[9px] md:right-0 bg-red-500 text-white rounded-full text-[8px] p-1 w-[9px] md:w-[12px] aspect-square flex items-center justify-center">
            <span className="max-sm:hidden">
              {unreadCount}
            </span>
          </span>
        )}
      </Link>
    </Button>
  );
}
