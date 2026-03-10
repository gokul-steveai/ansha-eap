"use client"
import PostEditor from "@/components/forms/postEditor";
import Container from "@/components/ui/container";

const Page = () => {
    return (
     <Container className="card w-full-sidebar">
        <div className="card flex-1 overflow-auto">
            <PostEditor />
          </div>
        </Container>
    );
}

export default Page;