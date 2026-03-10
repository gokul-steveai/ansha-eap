"use client"
import FormShortCourse from "@/components/forms/formShortCourse";
import Container from "@/components/ui/container";

const Page = () => {
    return (
     <Container className="card w-full-sidebar">
        <div className="card flex-1 overflow-auto">
            <FormShortCourse />
          </div>
        </Container>
    );
}

export default Page;