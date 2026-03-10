"use client";

import Alert from "@/components/ui/alert";
import {
    upsertUserActivity,
    UserActivity,
} from "@/serverActions/crudUserActivities";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAppServiceContext } from "./appServiceContext";

type ActivityAction = "read" | "watch";

type ActivityRecord = {
  user_id: string;
  target_id: string;
  target_type: string;
  action: ActivityAction;
  duration: number;
  activity_date: string;
  updated_at: string;
};

type useActivityLoggerProps = {
  targetId: string;
  targetType: string;
  action: ActivityAction;
}

export type LogActivityProps = {
  userId: string;
  targetId: string;
  targetType: string;
  action: ActivityAction;
  seconds: number;
};

const UserActivityContext = createContext<{
  logActivity: (props: LogActivityProps) => void;
  isUserActive: boolean;
  useActivityLogger: (props:useActivityLoggerProps)=>void;
} | null>(null);

export function UserActivityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const syncTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isUserActive, setIsUserActive] = useState(true);
  const [showIdleDialog, setShowIdleDialog] = useState(false);
  const {currentUser} = useAppServiceContext()
  const currentUserId = currentUser.id

  // 🔹 Reset localStorage every day
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const lastReset = localStorage.getItem("last_reset_date");

    if (lastReset !== today) {
      localStorage.removeItem("user_activities");
      localStorage.setItem("last_reset_date", today);
    }
  }, []);

  const showIdleDialogRef = useRef(false);
  useEffect(() => {
    showIdleDialogRef.current = showIdleDialog;
  }, [showIdleDialog]);

  useEffect(() => {
    const markActive = () => {
      // 🚫 Do nothing if dialog is showing
      if (showIdleDialogRef.current) return;

      setIsUserActive(true);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        setIsUserActive(false);
        setShowIdleDialog(true);
      }, 60000); // 1 minute for testing
    };

    const handleVisibility = () => {
      if (document.hidden) {
        setIsUserActive(false);
        setShowIdleDialog(true);
      } else {
        markActive();
      }
    };

    markActive(); // init

    // Global listeners
    window.addEventListener("mousemove", markActive);
    window.addEventListener("keydown", markActive);
    window.addEventListener("focus", markActive);
    window.addEventListener("scroll", markActive, { passive: true });
    document.addEventListener("visibilitychange", handleVisibility);

    // ✅ Scrollable containers
    const scrollContainers = document.querySelectorAll(".overflow-auto");
    scrollContainers.forEach((el) =>
      el.addEventListener("scroll", markActive, { passive: true })
    );

    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      window.removeEventListener("mousemove", markActive);
      window.removeEventListener("keydown", markActive);
      window.removeEventListener("focus", markActive);
      window.removeEventListener("scroll", markActive);
      document.removeEventListener("visibilitychange", handleVisibility);

      scrollContainers.forEach((el) =>
        el.removeEventListener("scroll", markActive)
      );
    };
  }, []);

  // 🔹 Sync periodically
  useEffect(() => {
    let lastSynced = "";

    syncTimer.current = setInterval(() => {
      const raw = localStorage.getItem("user_activities");
      if (!raw) return;

      if (raw !== lastSynced) {
        lastSynced = raw;
        const records = JSON.parse(raw) as Record<string, ActivityRecord>;
        const list = Object.values(records);

        if (list.length > 0) {
          syncActivities(list);
        }
      }
    }, 15000);

    return () => {
      if (syncTimer.current) clearInterval(syncTimer.current);
    };
  }, []);

  // 🔹 Save activity to localStorage
  function logActivity({
    userId,
    targetId,
    targetType,
    action,
    seconds,
  }: LogActivityProps) {
    if (!isUserActive) return; // 🚫 skip if idle

    const key = `${targetId}_${action}`;
    const existing = JSON.parse(
      localStorage.getItem("user_activities") || "{}"
    ) as Record<string, ActivityRecord>;

    const today = new Date().toISOString().split("T")[0];

    const record: ActivityRecord = existing[key] || {
      user_id: userId,
      target_id: targetId,
      target_type: targetType,
      action,
      duration: 0,
      activity_date: today,
      updated_at: new Date().toISOString(),
    };

    record.duration += seconds;
    record.updated_at = new Date().toISOString();

    existing[key] = record;
    localStorage.setItem("user_activities", JSON.stringify(existing));
  }

  // 🔹 Sync with server
  async function syncActivities(
    list: Omit<UserActivity, "id" | "created_at" | "updated_at">[]
  ) {
    for (const activity of list) {
      try {
        await upsertUserActivity(activity);
      } catch (err) {
        console.error("Failed to sync activity", activity, err);
      }
    }
  }

  // export separately, not via the context value
function useActivityLogger({
  targetId,
  targetType,
  action,
}: useActivityLoggerProps) {
  const { logActivity, isUserActive } = useUserActivityContext();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!targetId) return;

    const intervalDuration = 5000;
    const secondsIncrement = intervalDuration / 1000;

    intervalRef.current = setInterval(() => {
      if (!isUserActive) return;

      logActivity({
        userId: currentUserId, 
        targetId,
        targetType,
        action,
        seconds: secondsIncrement,
      });
    }, intervalDuration);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [targetId, targetType, action, logActivity, isUserActive, currentUserId]);
}


  return (
    <UserActivityContext.Provider value={{ logActivity, isUserActive, useActivityLogger }}>
      {children}

      {/* Idle dialog */}
      <Alert
        open={showIdleDialog}
        title="Are you still there?"
        okText="I'm here"
        showCancel={false}
        onOk={() => {
          setIsUserActive(true);
          setShowIdleDialog(false);
        }}
      />
    </UserActivityContext.Provider>
  );
}

export function useUserActivityContext() {
  const ctx = useContext(UserActivityContext);
  if (!ctx)
    throw new Error("useUserActivity must be used inside UserActivityProvider");
  return ctx;
}
