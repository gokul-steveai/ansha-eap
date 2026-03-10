"use client"
import PractitionerCard from "@/components/PractitionerCard";
import { Button } from "@/components/ui/button";
import { useAppServiceContext } from "@/context/appServiceContext";
import { getPractitioners, Practitioner } from "@/serverActions/crudPractitioners";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";



const Practitioners = () => {
  const {currentUser} = useAppServiceContext()
  const isAdmin = !!currentUser

  return (<>
    {isAdmin && (
        <div className="flex items-center justify-between">
          <Button
            href="/practioners/new"
            className="flex ml-auto"
          >
            <Plus /> Add New
          </Button>
        </div>
      )}
    <Content/>
    </>
  );
};

export default Practitioners;

function Content(){

  const [practitioners, setPractitioners] = useState<Practitioner[]>([])
  useEffect(()=>{
    getPractitioners()
    .then(r => {
      if(r.data){
        setPractitioners(r.data)
      }
    })
  },[])

  return   <div className="grid">
      <div>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 flex-wrap gap-5 gap-y-10 w-full-sidebar">
          {practitioners?.map((item) => (
            <PractitionerCard key={item.id} item={item} />
          ))}
        </div>
      </div>
      <div></div>
    </div>
}