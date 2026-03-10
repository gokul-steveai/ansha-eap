import { getServiceById } from "@/serverActions/crudServices";
import { Suspense } from "react";
import { Button } from "../ui/button";
import ImageWithFallback from "../ui/imageWithFallback";
import BookingRemainingCredit from "./BookingRemainingCredit";

export default function CounsellingCard() {
  return (
    <Suspense fallback={<Skeleton />}>
      {/* Suspense waits for HealthServices to resolve */}
      <Card />
    </Suspense>
  );
}

const Card = async () => {
    const serviceId = process.env.NODE_ENV == 'production' ? 'H_3Y4jhxE5' : '0UARbv_WYX'
  const { data } = await getServiceById(serviceId);
  
  if (!data) return <>Service not available</>;
  return (
    <div className="card rounded-lg p-4 min-w-[200px] flex flex-row gap-5 text-sm border">
      <ImageWithFallback
        className="aspect-video rounded-sm w-[200px] h-auto object-cover"
        width={200}
        height={120}
        src={data.image_url}
        alt={data.service_name}
      />
      <div className="flex flex-col gap-2 flex-1">
        <p className="text-base font-semibold leading-[1.2em]">We’re here to support your well-being.</p>
        <p className="text-xs">
            You have
            <span className="font-semibold underline"> <BookingRemainingCredit /> available </span> credits.
        </p>
        <div className="flex w-full mt-auto">
            <Button
            href={data.booking_link || "/health-services/booking"}
            className="btn-thin w-full ml-auto"
            {...(data.booking_link ? { target: "_blank" } : {})}
            >
            Book Now
            </Button>
        </div>
      </div>
    </div>
  );
};


const Skeleton = () => {
    return <>Loading...</>
}