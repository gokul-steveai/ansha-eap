import PostCardSkeleton from "@/components/post/postCardSkeleton";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import ImageWithFallback from "@/components/ui/imageWithFallback";
import { htmlToPlainText, truncateText } from "@/lib/helper";
import { getServices, Service } from "@/serverActions/crudServices";
import { Suspense } from "react";

export default function HealthServicesWrapper() {
  return (
    <Suspense fallback={<SkeletonGrid />}>
      {/* Suspense waits for HealthServices to resolve */}
      <HealthServices />
    </Suspense>
  );
}

const HealthServices = async () => {
  const { data } = await getServices();
  
const sortedServices = data?.sort((a, b) => 
  a.id === "H_3Y4jhxE5" ? -1 :
  b.id === "H_3Y4jhxE5" ? 1 :
  0
);

  return (
    <Container>
      <h3 className="my-5 text-xl text-muted-foreground">Services</h3>

      {data && (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 flex-wrap gap-5 gap-6 w-full-sidebar">
          {sortedServices && sortedServices.map((item) => (
            <Card key={item.id} item={item} />
          ))}
        </div>
      )}
    </Container>
  );
};

function Card({ item }: { item: Service }) {
  return (
    <div className="card rounded-lg p-4 min-w-[200px] flex flex-col gap-5 text-sm border">
      <ImageWithFallback
        className="rounded-sm w-full h-[140px] object-cover"
        width={200}
        height={100}
        src={item.image_url}
        alt={item.service_name}
      />
      <p className="text-base font-medium">{item.service_name}</p>

      <p className="text-muted-foreground text-xs">
        {truncateText(htmlToPlainText(item.description), 150)}
      </p>
      <div className="flex mt-auto">
        <Button
          href={item.booking_link || "/health-services/booking"}
          className="ml-auto"
          {...(item.booking_link ? { target: "_blank" } : {})}
        >
          Book Now
        </Button>
      </div>
    </div>
  );
}

// 🔹 Skeleton Loader for the grid
function SkeletonGrid() {
  return (
    <div className="grid md:grid-cols-3 lg:grid-cols-4 flex-wrap gap-5 gap-6 w-full-sidebar">
      {Array.from({ length: 6 }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  );
}
