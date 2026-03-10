import { htmlToPlainText, truncateText } from "@/lib/helper";
import { Practitioner } from "@/serverActions/crudPractitioners";
import { CalendarPlus } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import ImageWithFallback from "./ui/imageWithFallback";

export default function PractitionerCard({
    item,
}: {
    item: Practitioner;
}) {

    const professionalName = (`${item.title} ${item.first_name} ${item.last_name}`).trim()
    return (<>
        <div className="max-lg:max-w-[400px] bg-white border-1 rounded-3xl p-3 overflow-hidden gap-6 flex flex-row relative lg:min-w-[400px]">
            <div className="justify-center flex gap-4 flex-col p-2 w-[50%]">
                <div className="flex flex-col gap-2 justify-center">
                    <h3 className="md:text-lg font-bold">{professionalName}</h3>
                    <span className="capitalize underline text-xs md:text-sm decoration-muted-foreground decoration-[1px]">
                        {item.profession}
                    </span>
                </div>
                <p className="text-[12px] line-clamp-2">{item.description &&
                    truncateText(htmlToPlainText(item.description), 100)}</p>
                
                    <div className="flex flex-row items-center gap-2">
                        <Button
                        asChild
                            variant="outline"
                            className="ring-muted border-muted rounded-full !py-5 text-muted-foreground hover:bg-white hover:shadow-lg hover:scale-[1.02] hover:translate-y-[-2px]"
                        >
                            <Link
                            className="flex flex-row gap-2 flex-nowrap"
                                href={item.booking_link ?? '#'}
                            >
                                <CalendarPlus />
                                Book Now
                            </Link>

                        </Button>
                    </div>
                
            </div>
            <ImageWithFallback
                className="rounded-r-xl h-full w-[45%] object-cover bg-gray-100"
                width={800}
                height={100}
                src={item.profile_img || '/assets/images/img3.png'}
                alt={professionalName}
            />
        </div>
    </>
    );
}