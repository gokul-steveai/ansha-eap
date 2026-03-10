"use client"
import { PublicEventsColumns } from "@/components/dataTables/columns/ColumnPublicEvents";
import { DataTable } from "@/components/dataTables/dataTable";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { getPublicEvents, PublicEvent } from "@/serverActions/crudPublicEvents";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";

const Page = () => {

  const [data, setData] = useState<PublicEvent[]>([]);
  const [isFetching, setIsFetching] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsFetching(true);

        const res = await getPublicEvents({
          orderBy: 'date',
          order: 'DESC'
        });

        setData(res.data || []);
      } catch (error) {
        console.error("Failed to fetch public events:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, []);


  return (
    <Container className="card w-full-sidebar">
      <div className="flex flex-row">
        <h2 className="mb-5">Public Events </h2>
        <Button href="/admin/public-events/new" className="ml-auto">
          <PlusCircle /> Add New
        </Button>
      </div>
      <DataTable columns={PublicEventsColumns} isLoading={isFetching} data={data} />
    </Container>
  );
}

export default Page;