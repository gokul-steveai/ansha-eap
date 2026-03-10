import Container from "@/components/ui/container";
import { CalendarCheck, Heart } from "lucide-react";
import Link from "next/link";

export default function Page() {
    return (
        <Container className="card">
            <div className="flex flex-row items-center gap-4">
                <h3 className="section-title"></h3>
            </div>
            <div className="p-4 flex flex-row flex-wrap gap-4">

                <Link href="/user/appointments" className="items-center hover:ring-1 hover:ring-primary/80 bg-gray-50 flex flex-row flex-nowrap gap-2 p-4 rounded-lg">
                    <CalendarCheck className="w-4 h-4" />
                    <span className="text-sm">My Appointments</span>
                    
                </Link>
                <Link
                    className="items-center  hover:ring-1 hover:ring-primary/80 bg-gray-50 flex flex-row flex-nowrap gap-2 p-4 rounded-lg"
                    href="/user/favorites">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">My Favorites</span>
                </Link>

            </div>
        </Container>
    );
}