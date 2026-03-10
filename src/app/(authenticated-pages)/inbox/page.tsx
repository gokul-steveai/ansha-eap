"use client";

import Container from "@/components/ui/container";
import { PushNotificationToggle } from "@/components/webpush/PushNotificationToggle";
import { useInbox } from "@/context/InboxContext";
import { cn } from "@/lib/utils";
import { InboxItem } from "@/serverActions/crudInboxItem";
import Link from "next/link";

export default function Inbox() {
  const { inboxItems, loading, markAsRead } = useInbox();

  return (
    <Container className="card">
      <div className="bg-white sticky top-0 flex flex-row items-center justify-between gap-4 mb-4">
        <h3 className="section-title">Inbox</h3>
          <PushNotificationToggle />
      </div>

      <ul className="space-y-2">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <li
                key={i}
                className="animate-pulse p-4 border rounded-lg bg-gray-100 flex flex-col gap-2"
              >
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded w-full"></div>
              </li>
            ))
          : inboxItems.length === 0
          ? <li className="text-gray-500">No messages in your inbox.</li>
          : inboxItems.map((item) => (
              <InboxItemComponent markAsRead={markAsRead} key={item.id} item={item} />
            ))}
      </ul>
    </Container>
  );
}


function InboxItemComponent({ item, markAsRead }: { item: InboxItem, markAsRead: (itemId: string) => Promise<void> }) {
  const baseClass = 'block p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors';
  const unreadClass = item.status === "unread" ? "bg-blue-50" : "";

  if (item.url) {
    return (
      <li>
      <Link
        onClick={() => markAsRead(item.id)}
        href={item.url}
        className={cn(baseClass, unreadClass)}
      >
        <div className="flex justify-between mb-1">
          <h4 className="font-medium">{item.title}</h4>
        </div>
        <p className="muted-text">{item.body}</p>
        <p className="mt-3 muted-text">{new Date(item.created_at).toLocaleString()}</p>
      </Link>
      </li>
    );
  }

  return (
    <li>
    <div
      onClick={() => markAsRead(item.id)}
      className={cn(baseClass, unreadClass)}
    >
      <div className="flex justify-between mb-1">
        <h4 className="font-medium">{item.title}</h4>
      </div>
      <p className="muted-text">{item.body}</p>
      <p className="mt-3 muted-text">{new Date(item.created_at).toLocaleString()}</p>
    </div>
    </li>
  );
}
