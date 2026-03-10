"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { subscribeUser, unsubscribeUser } from "@/serverActions/webPushNotificationactions";
import { useAppServiceContext } from "./appServiceContext";
import { urlBase64ToUint8Array } from "@/lib/helper";

type PushNotificationContextType = {
  isSubscribed: boolean;
  isLoading: boolean;
  toggleSubscription: () => Promise<void>;
};

const PushNotificationContext = createContext<PushNotificationContextType | undefined>(undefined);

export function PushNotificationProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAppServiceContext();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

    const init = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/service-worker.js");
        const sub = await registration.pushManager.getSubscription();
        setIsSubscribed(!!sub);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        console.error("Service Worker registration failed:", error);
        alert("❌ Service Worker registration failed:\n" + error.message);
      }
    };

    init();
  }, [currentUser?.id]);

  const toggleSubscription = async () => {
    if (!currentUser?.id) {
      alert("No user found");
      return;
    }

    if (Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        alert("Notifications permission denied.");
        return;
      }
    }

    if (Notification.permission === "denied") {
      alert("You have blocked notifications. Please enable them in your browser settings.");
      return;
    }

    setIsLoading(true);

    try {
      const registration = await navigator.serviceWorker.ready;
      let sub: PushSubscription | null = await registration.pushManager.getSubscription();

      if (sub) {
        await sub.unsubscribe();
        setIsSubscribed(false);
        await unsubscribeUser(currentUser.id);
        alert("🔕 Notifications disabled");
      } else {
        sub = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
        });

        setIsSubscribed(true);
        await subscribeUser(JSON.parse(JSON.stringify(sub)), currentUser.id);
        alert("🔔 Notifications enabled");
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error("Push subscription failed:", error);
      alert("❌ Push subscription failed:\n" + error.message);
    }

    setIsLoading(false);
  };

  return (
    <PushNotificationContext.Provider value={{ isSubscribed, isLoading, toggleSubscription }}>
      {children}
    </PushNotificationContext.Provider>
  );
}

export function usePushNotifications(): PushNotificationContextType {
  const context = useContext(PushNotificationContext);
  if (!context) throw new Error("usePushNotifications must be used within PushNotificationProvider");
  return context;
}
