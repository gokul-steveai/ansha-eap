"use client"
import ServiceForm from "@/components/forms/formServices";
import Container from "@/components/ui/container";

const Page = () => {
    return (
        <Container className="card w-full-sidebar">
        <div className="card flex-1 overflow-auto">
            <ServiceForm />
        </div>
        </Container>
    );
}

export default Page;