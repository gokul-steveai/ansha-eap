"use client"
import FormMarli from "@/components/forms/formMarli";
import Container from "@/components/ui/container";

const Page = () => {
    return (
     <Container className="card w-full-sidebar">
        <div className="card flex-1 overflow-auto">
            <FormMarli />
          </div>
        </Container>
    );
}

export default Page;