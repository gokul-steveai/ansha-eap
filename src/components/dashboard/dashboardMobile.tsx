import Link from "next/link";
import DailyCheckInMobile from "../forms/dailyCheckin/dailyCheckInMobile";
import HealthNewsCarousel from "../post/HealthNewsCarousel";
import PublicEventsCarousel from "../publicEvents/PublicEventsCarousel";
import CounsellingCard from "../services/CounsellingCard";
import WeeklyBitesMobile from "../weeklyBitesMobile";

const DashboardMobile = () => {
  return (
    <div className="space-y-10 pb-[100px]">
      <div className="space-y-1">
         <div className="flex flex-row flex-nowrap">
          <span className="card-title">Mental Health Moments</span>
          <Link
            className="ml-auto text-sm text-app-purple-300 font-medium"
            href="/resources/7p2v1Ur_O4~mental-health-moments"
          >
            See all
          </Link>
        </div>
        <HealthNewsCarousel maxCount={15} className="simple" />
      </div>
      <div className="space-y-1">
        <div className="flex flex-row flex-nowrap">
          <span className="card-title">Public Sessions</span>
          <Link
            className="ml-auto text-sm text-app-purple-300 font-medium"
            href="/public-events"
          >
            See all
          </Link>
        </div>

        <PublicEventsCarousel/>
      </div>

      <div className="card text-white bg-primary p-0 overflow-hidden rounded-3xl">
        <DailyCheckInMobile isFocused={false} />
      </div>

      {/* counselling */}
      <div className="space-y-1">
        <div className="flex flex-row flex-nowrap">
          <span className="card-title">Counselling</span>
        </div>
        <CounsellingCard />
      </div>

      <div>
        <div className="flex flex-row flex-nowrap">
          <span className="card-title">Weekly Bites</span>
          <Link
            className="ml-auto text-sm text-app-purple-300 font-medium"
            href="/resources"
          >
            See all
          </Link>
        </div>
        <div className="flex-1">
          <WeeklyBitesMobile />
        </div>
      </div>
    </div>
  );
};

export default DashboardMobile;
