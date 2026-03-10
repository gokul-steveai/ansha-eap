import FormPractitioner from "@/components/forms/formPractitioner";
import Container from "@/components/ui/container";
import { getPractitionerById } from "@/serverActions/crudPractitioners";

interface DynamicPageProps {
  params: Promise<{ id: string }>;
}
export default async function Page({params}:DynamicPageProps) {
  const { id } = await params;

  // fetch data server-side
  const res = await getPractitionerById(id);
    
    return (
        <Container className="card w-full-sidebar">
        <div className="card flex-1 overflow-auto">
            <FormPractitioner practitioner={res.data}  />
        </div>
        </Container>
    );
}
