"use client";
import AppointmentList from "@/components/appointmentList";
import DailyCheckIn from "@/components/forms/dailyCheckin/dailyCheckIn";
import PublicEventsList from "@/components/publicEvents/publicEventsList";
import { Calendar } from "@/components/ui/calendar";
import Container from "@/components/ui/container";
import WillFocused from "@/components/ui/willFocused";
import WeeklyBites from "@/components/weeklyBites";
import FeaturedWidget from "@/components/widgets/FeaturedWidget";
import MoodWidget from "@/components/widgets/MoodWidget";

import Link from "next/link";

const Dashboard = () => {


  return (
    <div className="flex-1 h-full flex flex-col">
      <div className="flex flex-row h-full gap-6">
        <div className="flex-1 overflow-auto space-y-6">
          <WillFocused className="relative card text-white bg-primary" focusedClassName="pb-12">
            {({ isFocused, focusOnChange }) => (
              <DailyCheckIn
                isFocused={isFocused}
                focusOnChange={focusOnChange}
              />
            )}
          </WillFocused>
          <div className="flex flex-row flex-wrap basis-full min-h-[290px] max-h-fit gap-6">
            <div className="bg-[#26cec4] card p-0 w-1/3 min-w-[300px]">
              <FeaturedWidget />
            </div>

            <div className="card bg-white flex-1 overflow-hidden">
              <MoodWidget />
            </div>
          </div>

          <div className="card bg-white flex-1">
            <WeeklyBites />
          </div>
        </div>
        <Container className="card w-sidebar-right max-w-sidebar-right">
          <div className="space-y-10">
            <Calendar className="w-full text-xs calendar" />

            <div className="space-y-4">
              <div className="flex flex-row justify-between items-center">
                <div>
                  <p className="card-title">Public Sessions</p>
                  {/* <p className="text-sm text-muted-foreground">
                    Tuesday 1, July 2025
                  </p> */}
                </div>
                <Link
                  className="text-sm text-app-purple-300 font-medium"
                  href="/public-events"
                >
                  See all
                </Link>
              </div>

             <PublicEventsList />
            </div>

            <div className="space-y-2">
              <div className="flex flex-row justify-between items-center">
                <p className="card-title">My Appointments</p>
                <Link
                  className="text-sm text-app-purple-300 font-medium"
                  href="/user/appointments"
                >
                  See all
                </Link>
              </div>
                <AppointmentList count={2}/>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Dashboard;

