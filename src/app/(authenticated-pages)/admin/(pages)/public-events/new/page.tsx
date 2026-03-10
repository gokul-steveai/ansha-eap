"use client"
import PublicEventForm from "@/components/forms/formPublicEvents";
import Container from "@/components/ui/container";

const Page = () => {
    return (
     <Container className="card w-full-sidebar">
        <div className="card flex-1 overflow-auto">
            <PublicEventForm />
          </div>
        </Container>
    );
}

export default Page;