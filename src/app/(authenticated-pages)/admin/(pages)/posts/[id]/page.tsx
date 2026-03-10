"use client"
import PostEditor from "@/components/forms/postEditor";
import Container from "@/components/ui/container";
import { useParams } from "next/navigation";

const Page = () => {
      const params = useParams(); 
    const id = params?.id as string;
    return (
        <Container className="card w-full-sidebar">
        <div className="card flex-1 overflow-auto">
            <PostEditor postId={id} />
     </div>
        </Container>
    );
}

export default Page;