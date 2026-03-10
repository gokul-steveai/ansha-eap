// "use client"

// import AppointmentPicker from "@/components/AppointmentPIcker";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { bookAppointment, FhirAppointment, getAvailableAppointments } from "@/serverActions/halaxy/appointments";
// import { getHalaxyPractitioners, HalaxyPractitioner } from "@/serverActions/halaxy/practitioners";
// import { getHalaxyServices } from "@/serverActions/halaxy/services";
// import { useEffect, useState } from "react";
// import { Button } from "./ui/button";
// import { toast } from "sonner";
// import { useHalaxyServiceContext } from "@/context/HalaxyServiceContext";
// import { useRouter } from "next/navigation";
// import { useAppServiceContext } from "@/context/appServiceContext";
// import { FhirHealthcareService } from "@/serverActions/halaxy/types";

// export default function HalaxyBookingWidget() {
//     const router = useRouter()
//     const {currentUser} = useAppServiceContext()
//     const {setMyAppointments } = useHalaxyServiceContext()
//     const [practitioners, setPractitioners] = useState<HalaxyPractitioner[]>([])
//     const [services, setServices] = useState<FhirHealthcareService[]>([])
//     const [availableAppointments, setAvailableAppointments] = useState<FhirAppointment[]>()
    
//     // Form values
//     const [practitioner, setPractitioner] = useState<HalaxyPractitioner | null>(null)
//     const [service, setService] = useState<FhirHealthcareService | null>(null)
//     const [appointmentSched, setAppointmentSched] = useState<Date | null>(null)

//     // 
//     const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

//     // Init practitioners, services, and timezones
//     useEffect(() => {
//         async function fetchData() {
//             const [halaxyServices, halaxyPractitioners] = await Promise.all([
//                 getHalaxyServices(),
//                 getHalaxyPractitioners()
//             ]);
//             setServices(halaxyServices)
//             setPractitioners(halaxyPractitioners)
//         }

//         fetchData()
//     }, [])

//     // Fetch available appointments when practitioner and service are selected
//     useEffect(() => {
//         if (!practitioner || !service) return

//         const today = new Date()
//         const oneMonthFromToday = new Date(today);
//         oneMonthFromToday.setMonth(today.getMonth() + 1);

//         const data = {
//             practitionerRole: practitioner.roleId,
//             start: today.toISOString(),
//             end: oneMonthFromToday.toISOString(),
//             duration: service.extension[0].valueQuantity?.value ?? 50,
//         }

//         getAvailableAppointments(data)
//             .then(res => setAvailableAppointments(res))
//             .catch(err => console.log(err))


//     }, [practitioner, service])

//     const handleBookAppointment = async () => { 
//         const myPatientId = currentUser.patient_id
//         if (!appointmentSched || !availableAppointments) return
//         setIsSubmitting(true)
//         const selectedAppointment = availableAppointments.find(appointment => +new Date(appointment.start) == +appointmentSched)


//         if (!selectedAppointment || !myPatientId || !service) {
//             toast.error('Something went wrong, Contact Admin')
//         } else {
//             try {
//                 const createdAppt = await bookAppointment({
//                     appointment: selectedAppointment,
//                     patientId: myPatientId,
//                     serviceId: service?.id
//                 })

//                 if (createdAppt.resourceType == "Appointment") {
//                     setMyAppointments((prev) => {
//                         return prev ? [...prev, createdAppt] : [createdAppt]
//                     })
//                 }
//                 toast.success('Appointment booked successfully!', {
//                 description: "You’ll receive a confirmation email shortly.",
//                 });

//                 router.push('/user/appointments')


//             } catch (err) {

//                 console.log(err)
//                 toast.error('Something went wrong, Contact Admin')
//             }

//         }

//         setIsSubmitting(false)
//     }


//     console.log(availableAppointments, 'available Appointments')
//     return (
//         <div className="w-full h-full">
//             <div className="space-y-4 p-4">

//                 {/* Practitioner Select */}
//                 <div>
//                     <label className="block text-sm font-medium mb-1">Select Practitioner</label>
//                     <Select
//                         value={practitioner?.id || ""}
//                         onValueChange={(val) => {
//                             const selected = practitioners.find(p => p.id === val) || null;
//                             setPractitioner(selected);
//                         }}
//                     >
//                         <SelectTrigger className="bg-white whitespace-normal text-start !h-fit">
//                             <SelectValue placeholder="Choose a practitioner" />
//                         </SelectTrigger>
//                         <SelectContent>
//                             {practitioners.map((p) => (
//                                 <SelectItem key={p.id} value={p.id}>
//                                     {p.firstName} {p.lastName} ({p.profession})
//                                 </SelectItem>
//                             ))}
//                         </SelectContent>
//                     </Select>
//                 </div>

//                 {/* Service Select */}
//                 <div>
//                     <label className="block text-sm font-medium mb-1">Select Service</label>
//                     <Select
//                         value={service?.id || ""}
//                         onValueChange={(val) => {
//                             const selected = services.find(s => s.id === val) || null;
//                             setService(selected);
//                         }}
//                     >
//                         <SelectTrigger className="bg-white whitespace-normal text-start !h-fit">
//                             <SelectValue placeholder="Choose a service" />
//                         </SelectTrigger>
//                         <SelectContent>
//                             {services.map((s) => (
//                                 <SelectItem key={s.id} value={s.id}>
//                                     {s.name} ({s.extension[0].valueQuantity?.value ?? 50} min)
//                                 </SelectItem>
//                             ))}
//                         </SelectContent>
//                     </Select>
//                 </div>

//                 {/* Appointment Date picker */}

//                 {availableAppointments && availableAppointments.length > 0 &&
//                     <div>
//                         <AppointmentPicker
//                             availableTimestamps={availableAppointments.map(appointment => {
//                                 return new Date(appointment.start).getTime()
//                             })}
//                             onSelect={(date) => setAppointmentSched(date)}

//                         />
//                     </div>
//                 }

//                 {appointmentSched &&
//                     <Button
//                     isLoading={isSubmitting}
//                         onClick={handleBookAppointment}

//                         className="font-bold !px-4 float-right max-sm:h-16 max-sm:mb-4 max-sm:w-full"
//                     >
//                         Book Appointment
//                     </Button>
//                 }
//             </div>
//         </div>
//     );
// }
