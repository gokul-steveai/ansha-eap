"use client"
import FormAccount from "@/components/forms/formAccount";
import Container from "@/components/ui/container";

const AccountPage = () => {
    

    return (
        <div className="flex flex-row flex-nowrap gap-6 max-w-[1000px]">
            <Container className="card">
                <FormAccount />
            </Container>
         
     
        </div>
    );
}

export default AccountPage;