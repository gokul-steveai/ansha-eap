"use client"
import { DataTable } from "@/components/dataTables/dataTable";
import { Button } from "@/components/ui/button";
import { usePostServiceContext } from "@/context/postServiceContext";
import { PlusCircle } from "lucide-react";
import Container from "@/components/ui/container";
import { useCategoryColumns } from "@/components/dataTables/categories/CategoriesColumn";

const Page = () => {
    const {categories, isFetching} = usePostServiceContext()
    return (
       <Container className="card w-full-sidebar">
              <div className="flex flex-row">
                <h2 className="mb-5">Categories </h2>
                <Button href="/admin/categories/new" className="ml-auto">
                  <PlusCircle /> Add Category
                </Button>
              </div>
                <DataTable columns={useCategoryColumns()} isLoading={isFetching} data={categories}/>              
        </Container>
    );
}

export default Page;