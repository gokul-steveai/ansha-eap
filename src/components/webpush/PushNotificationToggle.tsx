"use client";

import { usePushNotifications } from "@/context/PushNotificationContext";
import { Switch } from "@/components/ui/switch";

export function PushNotificationToggle() {
  const { isSubscribed, toggleSubscription, isLoading } = usePushNotifications();

  return (
    <div className="flex items-center gap-2 relative">
      <label htmlFor="toggleNotification" className="text-sm text-gray-700">
        Notifications
      </label>

      <Switch
        id="toggleNotification"
        className="cursor-pointer"
        checked={isLoading || isSubscribed} // show ON while loading
        onCheckedChange={toggleSubscription}
        disabled={isLoading} // prevent interaction while loading
      />

      {isLoading && (
        <div className="ml-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></div>
        </div>
      )}
    </div>
  );
}
