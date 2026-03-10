"use client";

import { useHalaxyServiceContext } from "@/context/HalaxyServiceContext";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

type AppointmentListProps = {
  count?: number;
  itemClassName?: string;
  showCancel?: boolean;
};

const AppointmentList = ({ count, itemClassName, showCancel }: AppointmentListProps) => {
  const dateFormatter = new Intl.DateTimeFormat("en-AU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const { myAppointments, cancelAppointment, rebookAppointment } = useHalaxyServiceContext();

  const allAppointments = myAppointments ? myAppointments.flatMap(a => a.appointments) : []
  if (myAppointments == null) {
    return (
      <div className="space-y-4">
        {[...Array(count ?? 1)].map((_, idx) => (
          <div
            key={idx}
            className="rounded-xl p-4 bg-muted animate-pulse h-16"
          />
        ))}
      </div>
    );
  }

  if (allAppointments.length === 0) {
    return (
      <div className={cn("rounded-xl p-4 flex flex-row justify-between items-center", itemClassName)}>
        <div className="text-zinc-500 flex h-[38px] items-center">
          <p className="font-medium">No upcoming appointments</p>
        </div>
      </div>
    );
  }

  const appointmentsToShow = count
    ? allAppointments.slice(0, count)
    : allAppointments;

  const now = new Date();

  return (
    <div className="space-y-4">
      {appointmentsToShow.map((i) => {
        const startDate = new Date(i.start);
        const isCancelled = JSON.stringify(i)?.includes('"code":"cancelled","display":"cancelled"') || false;
        const hasPassed = startDate < now; // appointment has passed
        const canCancel = startDate > new Date(now.getTime() + 24 * 60 * 60 * 1000); // only cancel if > 1 day away

        return (
          <Link
            key={i.id}
            className={cn("rounded-xl p-4 flex flex-row justify-between items-center", itemClassName)}
            href={`/user/appointments?${i.id}`}
          >
            <div className="flex-1 text-zinc-500">
              <p className="font-medium flex flex-row items-center gap-1">
                Consultation{" "}
                {isCancelled && (
                  <Badge className="bg-red-400/80 text-[10px] px-1.5 py-0.5 h-auto leading-none">
                    Cancelled
                  </Badge>
                )}
                {!isCancelled && hasPassed && (
                  <Badge className="bg-app-green-400/80 text-[10px] px-1.5 py-0.5 h-auto leading-none">
                    Attended
                  </Badge>
                )}
              </p>
              <p className="muted-text">
                {dateFormatter.format(startDate)}
              </p>
              <div className="space-x-2">
                {!isCancelled && showCancel && canCancel && (
                  <Button
                    variant="link"
                    className="!p-0 text-secondary"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      cancelAppointment(i.id);
                    }}
                  >
                    Cancel
                  </Button>
                )}
                {!hasPassed && !isCancelled && showCancel && !canCancel && (
                  <span className="text-orange-400 text-sm">
                    Cannot cancel – appointment is soon or already started
                  </span>
                )}
                {!hasPassed && isCancelled && (
                  <Button
                    variant="link"
                    className="!p-0 text-secondary"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      rebookAppointment(i.id);
                    }}
                  >
                    Rebook
                  </Button>
                )}
              </div>
            </div>
            <span className="max-md:hidden text-xl font-medium line-through">
              $200
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default AppointmentList;
