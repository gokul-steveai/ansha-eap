"use client"

import { PartnersColumns } from "@/components/dataTables/columns/ColumnPartners";
import { DataTable } from "@/components/dataTables/dataTable";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { getPartners, Partner } from "@/serverActions/crudPartners";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";

const Page = () => {

  const [data, setData] = useState<Partner[]>([]);
  const [isFetching, setIsFetching] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsFetching(true);

        const res = await getPartners({
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
        <h2 className="mb-5">Partner </h2>
        <Button href="/admin/partners/new" className="ml-auto">
          <PlusCircle /> Add New
        </Button>
      </div>
      <DataTable columns={PartnersColumns} isLoading={isFetching} data={data} />
    </Container>
  );
}

export default Page;