"use client";
import CompanyForm from "@/components/forms/formCompanies";
import Container from "@/components/ui/container";

const Page = () => {
  return (
    <Container className="card w-full-sidebar">
      <div className="card flex-1 overflow-auto">
        <CompanyForm />
      </div>
    </Container>
  );
};

export default Page;
