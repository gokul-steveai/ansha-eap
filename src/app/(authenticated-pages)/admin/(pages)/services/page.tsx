"use client"

import { ServiceColumns } from "@/components/dataTables/services/serviceColumn";
import { DataTable } from "@/components/dataTables/dataTable";
import { Button } from "@/components/ui/button";
import { getServices, Service } from "@/serverActions/crudServices";
import { PlusCircle } from "lucide-react";
import Container from "@/components/ui/container";
import { useEffect, useState } from "react";

const Page = () => {
  
  const [data, setData] = useState<Service[]>([])
  const [isFetching, setIsFetching] = useState(true)

  useEffect(()=>{
    const fetchData = async () => {
      try {
        setIsFetching(true);
  
        const res = await getServices();
  
        setData(res.data || []);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setIsFetching(false);
      }
    };
  
    fetchData();
  }, []);

  return (
    <Container className="card w-full-sidebar">
      <div className="flex flex-row">
        <h2 className="mb-5">Services </h2>
        <Button href="/admin/services/new" className="ml-auto">
          <PlusCircle /> Add Service
        </Button>
      </div>
      <DataTable columns={ServiceColumns} isLoading={isFetching} data={data} />
    </Container>
  );
};

export default Page;
