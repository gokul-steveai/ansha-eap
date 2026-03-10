"use client"
import FormPractitioner from "@/components/forms/formPractitioner";
import Container from "@/components/ui/container";

const Page = () => {
    
    return (
        <Container className="card w-full-sidebar">
        <div className="card flex-1 overflow-auto">
            <FormPractitioner />
        </div>
        </Container>
    );
}

export default Page;