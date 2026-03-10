"use client"
import CategoryEditor from "@/components/forms/CategoryEditor";
import Container from "@/components/ui/container";

const Page = () => {
    return (
     <Container className="card w-full-sidebar">
        <div className="card flex-1 overflow-auto">
            <CategoryEditor />
          </div>
        </Container>
    );
}

export default Page;