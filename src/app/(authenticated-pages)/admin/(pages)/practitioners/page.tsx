"use client"
import { DataTable } from "@/components/dataTables/dataTable";
import { PractitionerColumn } from "@/components/dataTables/practitioners/practitionerColumn";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { getPractitioners, Practitioner } from "@/serverActions/crudPractitioners";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";

const Page = () => {
    
      const [data, setData] = useState<Practitioner[]>([]);
      const [isFetching, setIsFetching] = useState(true)
    
      useEffect(() => {
        const fetchData = async () => {
          try {
            setIsFetching(true);
    
            const res = await getPractitioners();
    
            setData(res.data || []);
          } catch (error) {
            console.error("Failed to fetch practitioners:", error);
          } finally {
            setIsFetching(false);
          }
        };
    
        fetchData();
      }, []);
      
    return (
       <Container className="card w-full-sidebar">
              <div className="flex flex-row">
                <h2 className="mb-5">Practitioners </h2>
                <Button href="/admin/practitioners/new" className="ml-auto">
                  <PlusCircle /> Add Practitioner
                </Button>
              </div>
              <DataTable className="flex-1" columns={PractitionerColumn} isLoading={isFetching} data={data}/>
        </Container>
    );
}

export default Page;