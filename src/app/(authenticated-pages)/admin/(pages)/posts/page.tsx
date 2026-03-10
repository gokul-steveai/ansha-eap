"use client"
import { usePostColumns } from "@/components/dataTables/posts/postColumns";
import { DataTable } from "@/components/dataTables/dataTable";
import { Button } from "@/components/ui/button";
import { usePostServiceContext } from "@/context/postServiceContext";
import { PlusCircle } from "lucide-react";
import Container from "@/components/ui/container";

const Page = () => {
    const {allPosts} = usePostServiceContext()
    const filtered = allPosts.filter(p => p.category != '7p2v1Ur_O4')
    return (
       <Container className="card w-full-sidebar">
              <div className="flex flex-row">
                <h2 className="mb-5">Post </h2>
                <Button href="/admin/posts/new" className="ml-auto">
                  <PlusCircle /> Add Post
                </Button>
              </div>
                <DataTable columns={usePostColumns()} data={filtered}/>              
        </Container>
    );
}

export default Page;