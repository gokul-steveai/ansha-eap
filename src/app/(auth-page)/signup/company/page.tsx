import CompanyForm from "@/components/forms/formCompanies";
import Container from "@/components/ui/container";

const Page = () => {
    return (
        
       <Container className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <CompanyForm className="card w-[600px]" />
       </Container>
    );
}

export default Page;