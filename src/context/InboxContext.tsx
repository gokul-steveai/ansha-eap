// context/InboxContext.tsx
"use client";
import { getInboxItems, InboxItem, markInboxItemAsRead } from "@/serverActions/crudInboxItem";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAppServiceContext } from "./appServiceContext";
import { inboxMockData } from "@/app/demo/demoData";

type InboxContextType = {
  inboxItems: InboxItem[];
  loading: boolean;
  refresh: () => void;
  markAsRead: (itemId: string) => Promise<void>;
};


const isTest = false
const InboxContext = createContext<InboxContextType | undefined>(undefined);

export function InboxProvider({ children }: { children: ReactNode }) {


  const { currentUser } = useAppServiceContext();
  const [inboxItems, setInboxItems] = useState<InboxItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInbox = async () => {
    
    if (!currentUser?.id) return;
    setLoading(true);
    try {
      if(isTest){

        setInboxItems(inboxMockData)
      } else {
        const res = await getInboxItems(currentUser.id);
        if (res.success && res.data) setInboxItems(res.data);
      }
      
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (itemId: string) => {
    try {
      const res = await markInboxItemAsRead(itemId);
      if (res.success && res.data) {
        setInboxItems((prev) =>
          prev.map((item) =>
            item.id === itemId ? { ...item, status: "read", read_at: res.data?.read_at } : item
          )
        );
      }
    } catch (err) {
      console.error("Failed to mark inbox item as read:", err);
    }
  };

  useEffect(() => {
    if (currentUser?.id) fetchInbox();
  }, [currentUser?.id]);




useEffect(() => {
  if (!('serviceWorker' in navigator) || !currentUser?.id) return;

  const handleMessage = (event: MessageEvent) => {
    if (!event.data) return;

    const { type } = event.data;
    if (type === 'NEW_INBOX_ITEM') {
      fetchInbox();
    }
  };

  navigator.serviceWorker.addEventListener('message', handleMessage);

  return () => {
    navigator.serviceWorker.removeEventListener('message', handleMessage);
  };
}, [currentUser?.id]);



  return (
    <InboxContext.Provider value={{ inboxItems, loading, refresh: fetchInbox, markAsRead }}>
      {children}
    </InboxContext.Provider>
  );
}

export function useInbox() {
  const context = useContext(InboxContext);
  if (!context) throw new Error("useInbox must be used within InboxProvider");
  return context;
}
