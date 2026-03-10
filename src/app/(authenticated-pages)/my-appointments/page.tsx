import AppointmentList from "@/components/appointmentList";
import Container from "@/components/ui/container";

export default function MyAppointmentsPage() {
    return (
        <Container className="card">
            <div className="flex flex-row items-center gap-4">
                <h3 className="section-title">My Appointments</h3>                
            </div>
            <div className="p-4">
                <AppointmentList itemClassName="bg-gray-50" showCancel />
            </div>
        </Container>
    );
}