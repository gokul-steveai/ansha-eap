import FormCriticalIncidentResponse from "@/components/forms/FormCriticalIncidentResponse";
import Container from "@/components/ui/container";

export default function Page() {
    return (
        <Container className="card">
               <div className="flex flex-row items-center gap-4">
                <h3 className="section-title">Critical Incident Response</h3>                
            </div>
            <div className="p-4 max-w-lg">
                <FormCriticalIncidentResponse/>
            </div>
        </Container>
    );
}