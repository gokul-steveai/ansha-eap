"use client"

import HalaxyBookingWidget from "@/components/HalaxyBookingWidget";
import Container from "@/components/ui/container";
import { useParams } from "next/navigation";

export default function Page() {
    const params = useParams()
    const practitioner_role = params.practitioner_role as string
    

    return (
        <Container className="card">
            {practitioner_role &&
                <HalaxyBookingWidget
                practitioner_role={practitioner_role}
                />
            }
        </Container>
    );
}