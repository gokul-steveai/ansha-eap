"use client"

import { MarliColumns } from "@/components/dataTables/columns/ColumnMarli";
import { DataTable } from "@/components/dataTables/dataTable";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { getMarlis, Marli } from "@/serverActions/crudMarli";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";

const Page = () => {

  const [data, setData] = useState<Marli[]>([]);
  const [isFetching, setIsFetching] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsFetching(true);

        const res = await getMarlis({
          orderBy: 'date',
          order: 'DESC'
        })

        setData(res.data || []);
      } catch (error) {
        console.error("Failed to fetch partners:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Container className="card w-full-sidebar">
      <div className="flex flex-row">
        <h2 className="mb-5">Marli </h2>
        <Button href="/admin/marli/new" className="ml-auto">
          <PlusCircle /> Add New
        </Button>
      </div>
      <DataTable columns={MarliColumns} isLoading={isFetching} data={data} />
    </Container>
  );
}

export default Page;