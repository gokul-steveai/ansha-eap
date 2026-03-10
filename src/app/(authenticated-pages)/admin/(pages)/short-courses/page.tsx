"use client"


import { ColumnShortCourse } from "@/components/dataTables/columns/ColumnShortCourses";
import { DataTable } from "@/components/dataTables/dataTable";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { getShortCourses, ShortCourse } from "@/serverActions/crudShortCourses";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";

const Page = () => {
  const [shortCourses, setShortCourses] = useState<ShortCourse[]>([]);
  const [isFetching, setIsFetching] = useState(true)
  
useEffect(() => {
  const fetchCourses = async () => {
    try {
      setIsFetching(true);

      const res = await getShortCourses({
        orderBy: "created_at",
        order: "DESC",
      });

      setShortCourses(res.data || []);
    } catch (error) {
      console.error("Failed to fetch short courses:", error);
    } finally {
      setIsFetching(false);
    }
  };

  fetchCourses();
}, []);

  return (
    <Container className="card w-full-sidebar">
      <div className="flex flex-row">
        <h2 className="mb-5">Short Courses </h2>
        <Button href="/admin/short-courses/new" className="ml-auto">
          <PlusCircle /> Add New
        </Button>
      </div>
      
        <DataTable columns={ColumnShortCourse} isLoading={isFetching} data={shortCourses} />
       
    </Container>
  );
}

export default Page;