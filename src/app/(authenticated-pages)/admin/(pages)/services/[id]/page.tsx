import ServiceForm from "@/components/forms/formServices";
import Container from "@/components/ui/container";
import { getServiceById } from "@/serverActions/crudServices";

interface DynamicPageProps {
  params: Promise<{ id: string }>;
}
export default async function Page({params}:DynamicPageProps) {
  const { id } = await params;

  // fetch data server-side
  const res = await getServiceById(id);
    
    return (
        <Container className="card w-full-sidebar">
        <div className="card flex-1 overflow-auto">
            <ServiceForm service={res.data}  />
        </div>
        </Container>
    );
}
