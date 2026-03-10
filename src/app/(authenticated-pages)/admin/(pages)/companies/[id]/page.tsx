import CompanyForm from "@/components/forms/formCompanies";
import Container from "@/components/ui/container";
import { getCompanyById } from "@/serverActions/crudCompanies";

interface DynamicPageProps {
  params: Promise<{ id: string }>;
}
export default async function Page({ params }: DynamicPageProps) {
  const { id } = await params;

  // fetch data server-side
  const company = await getCompanyById(id);

  return (
    <Container className="card w-full-sidebar">
      <div className="card flex-1 overflow-auto">
        <CompanyForm company={company.data} />
      </div>
    </Container>
  );
}
