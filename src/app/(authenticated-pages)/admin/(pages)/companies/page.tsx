"use client"
import { CompanyColumns } from "@/components/dataTables/companies/companyColumn";
import { DataTable } from "@/components/dataTables/dataTable";

import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { useElevateAdminContext } from "@/context/ElevateAdminContext";
import { getPractitioners, Practitioner } from "@/serverActions/crudPractitioners";
import { CLINIC_LOCATIONS } from "@/serverActions/halaxy/const";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";

const Page = () => {
  const {companies, isFetching} = useElevateAdminContext()
  const [isFetchingPractitioners, setIsFetchingPractitioners] = useState(true)
  const [practitioners, setPractitioners] = useState<Practitioner[]>([])
    
      useEffect(() => {
        const fetchData = async () => {
          try {
            setIsFetchingPractitioners(true);
    
            const res = await getPractitioners();
    
            setPractitioners(res.data || []);
          } catch (error) {
            console.error("Failed to fetch practitioners:", error);
          } finally {
            setIsFetchingPractitioners(false);
          }
        };
    
        fetchData();
      }, []);

const mutatedCompanies = companies.map(c => {
  return {
    ...c,
    practitioners: c.practitioners.map(pid => {
      const practitioner = practitioners.find(p => p.id == pid)
      return `${practitioner?.first_name} ${practitioner?.last_name}`
    }),
    locations: c.locations.map(lid => {
      const location = CLINIC_LOCATIONS.find(cl => cl.value == lid)
      return `${location?.label}`
    })
  }
})
  
  return (
    <Container className="card w-full-sidebar">
      <div className="flex flex-row">
        <h2 className="mb-5">Companies </h2>
        <Button href="/admin/companies/new" className="ml-auto">
          <PlusCircle /> Add Company
        </Button>
      </div>

      <DataTable columns={CompanyColumns} isLoading={isFetching || isFetchingPractitioners} data={mutatedCompanies} />
    </Container>
  );
};

export default Page;
