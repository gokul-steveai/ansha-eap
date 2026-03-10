import AppointmentList from "@/components/appointmentList";
import Container from "@/components/ui/container";

export default function MyAppointmentsPage() {
    return (
        <Container className="card">
            <div className="flex flex-row items-center gap-4 mb-4">
                <h3 className="section-title">My Appointments</h3>                
            </div>            
            <AppointmentList itemClassName="bg-gray-50" showCancel />

        </Container>
    );
}