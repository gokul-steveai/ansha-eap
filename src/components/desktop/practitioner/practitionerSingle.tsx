import BookingWidget from "@/components/bookingWidget";
import Container from "@/components/ui/container";
import ImageWithFallback from "@/components/ui/imageWithFallback";
import { getPractitionerById } from "@/serverActions/crudPractitioners";
import { Suspense } from "react";

interface PractionerSingleProps {
  params: Promise<{ slug: string }>;
}

const PractionerSingle = async ({ params }: PractionerSingleProps) => {
  const {slug} = await params
  const id = slug.split("~")[0];

  return (
    <Suspense
      fallback={
        <div className="flex gap-6 h-full animate-pulse">
          <Container className="card max-w-[400px]">
            <div className="flex flex-col items-center p-4">
              <div className="bg-gray-300 rounded-full w-24 h-24 mb-4" />
              <div className="h-6 bg-gray-300 w-32 rounded mb-2" />
              <div className="h-4 bg-gray-300 w-20 rounded mb-2" />
              <div className="h-3 bg-gray-300 w-40 rounded mt-4" />
              <div className="h-3 bg-gray-300 w-36 rounded mt-2" />
              <div className="h-3 bg-gray-300 w-32 rounded mt-2" />
            </div>
          </Container>

          <Container className="card bg-[#e9ecef]">
            <div className="h-48 bg-gray-300 rounded" />
          </Container>
        </div>
      }
    >
      {id ? <Single id={id} /> : <p>Practitioner not found</p>}
    </Suspense>
  );
};

export default PractionerSingle;

async function Single({ id }: { id: string }) {
  const { data: practionerData } =  await getPractitionerById(id);
  
  
  if (!practionerData) {
    return <p>Practitioner not found</p>;
  }
  const bookingLink = practionerData.booking_link
  const professionalName = `${practionerData.title} ${practionerData.first_name} ${practionerData.last_name}`.trim();

  return (
    <div className="flex gap-6 h-full">
      <Container className="card max-w-[400px]">
        <div className="flex flex-col items-center p-4">
          <ImageWithFallback
            src={practionerData.profile_img}
            alt={professionalName}
            width={100}
            height={100}
            className="mx-auto rounded-full aspect-square object-cover"
          />
          <h3 className="font-bold text-center">{professionalName}</h3>
          <p className="py-1 px-4 text-sm rounded-full bg-primary text-white w-fit text-center">
            {practionerData.profession}
          </p>
        </div>
        <div
          className="prose text-sm mt-2 text-muted-foreground max-w-none whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: practionerData.description ?? "" }}
        />
      </Container>

      <Container className="card bg-[#e9ecef]">
          {bookingLink && <BookingWidget link={bookingLink} />}
      </Container>
    </div>
  );
}
