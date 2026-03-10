import FormCriticalIncidentResponse from "../forms/FormCriticalIncidentResponse";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "../ui/dialog";

export default function DialogFormCriticalIncidentResponse() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                className="w-full"
                variant="outline">
                    Sumbmit a response
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader className="mb-4">
                    <h2>Critical Incident Response</h2>
                </DialogHeader>
                <FormCriticalIncidentResponse />
            </DialogContent>
        </Dialog>
    );
}