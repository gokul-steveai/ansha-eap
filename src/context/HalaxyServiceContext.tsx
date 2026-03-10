"use client";
import { FhirAppointment, getUserAppointments, isSlotAvailable, updateAppointmentStatus } from "@/serverActions/halaxy/appointments";
import { createPatient } from "@/serverActions/halaxy/patients";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { useAppServiceContext } from "./appServiceContext";
import { useConfirmDialog } from "./ConfirmContext";
import { updateUser } from "@/serverActions/crudUsers";
import { useRouter } from "next/navigation";

type Appointments = { account_id: string; appointments: FhirAppointment[] }[] | null

type HalaxyServiceContextType = {
  myAppointments: Appointments;
  setMyAppointments: (appointments:Appointments) => void;
  cancelAppointment: (appointmentId: string) => void;
  rebookAppointment: (appointmentId: string) => void;
  creditLimit: number;
  creditUsed: number;
  remainingCredit?: number;
};

type HalaxyServiceContextProviderProps = {
  children?: React.ReactNode;
};

const HalaxyServiceContext = createContext<HalaxyServiceContextType | null>(null);

export function HalaxyServiceContextProvider({
  children
}: HalaxyServiceContextProviderProps) {
  const router = useRouter()
  const { currentUser, setCurrentUser } = useAppServiceContext()
  const [myAppointments, setMyAppointmentsState] = useState<Appointments>(null);
  const confirm = useConfirmDialog()
  const patientCreatedRef = useRef(false);

  useEffect(() => {
    if (!currentUser || patientCreatedRef.current) return;

    const handlePatient = async () => {
      const myPatientId = currentUser.patient_id;

      if (!myPatientId) {
        try {
          const cpRes = await createPatient({
            givenName: currentUser.first_name,
            familyName: currentUser.last_name,
            email: currentUser.email,
          });
          const patientId = cpRes.id;

          if (patientId) {
            await updateUser(currentUser.id, { patient_id: patientId });
            setCurrentUser((prev) => ({ ...prev, patient_id: patientId }));
            patientCreatedRef.current = true; // prevent loop
          }
        } catch (err) {
          console.error(err);
        }
      }
    };

    handlePatient();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser?.patient_id?.length) return;

    const fetchAppointments = async () => {
      try {
        const results = await Promise.all(
          currentUser.patient_id.map(p =>
            getUserAppointments(p.patient_id, p.account_id)
          )
        );


        const allAppointments = currentUser.patient_id.map((p, idx) => ({
          account_id: p.account_id,
          appointments: results[idx],
        }));

        setMyAppointmentsState(allAppointments);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      }
    };

    fetchAppointments();
  }, [currentUser?.patient_id]);




  // async function cancelAppointment(appointmentId: string) {
  //   const appointmentAccount = myAppointments?.find(ma =>
  //     ma.appointments.some(a => a.id === appointmentId)
  //   );
  //   if (!appointmentAccount) return
  //   const accountId = appointmentAccount.account_id
  //   const myPatientId = currentUser.patient_id.find(p => p.account_id === accountId)?.patient_id
  //   if (!myPatientId) return

  //   const ok = await confirm({
  //     title: "Cancel appointment?",
  //     description: "Are you sure you want to cancel this appointment?",
  //     okText: "Yes",
  //     cancelText: "No",
  //   })

  //   if (!ok) return
  //   toast.promise(updateAppointmentStatus('cancelled', appointmentId, myPatientId, accountId)
  //     .then(
  //       (updatedAppt) => {
  //         const newAppointments = myAppointments ? [...myAppointments] : []
  //         const toUpdateAppointmentIndex = newAppointments.findIndex(ma => ma.account_id == appointmentAccount.account_id)

  //         if (toUpdateAppointmentIndex !== -1) {
  //           newAppointments[toUpdateAppointmentIndex] = {
  //             ...newAppointments[toUpdateAppointmentIndex],
  //             appointments: newAppointments[toUpdateAppointmentIndex].appointments.map(a =>
  //               a.id === updatedAppt.id ? updatedAppt : a
  //             ),
  //           };
  //         }

  //         setMyAppointmentsState(newAppointments);
  //         return updatedAppt;
  //       }
  //     ), {
  //     loading: "Cancelling appointment...",
  //     success: "Appointment cancelled",
  //     error: "Failed to cancel",
  //   })
  // }


  async function cancelAppointment(appointmentId: string) {
    const appointmentAccount = myAppointments?.find(ma =>
      ma.appointments.some(a => a.id === appointmentId)
    );
    if (!appointmentAccount) return
    const accountId = appointmentAccount.account_id
    const myPatientId = currentUser.patient_id.find(p => p.account_id === accountId)?.patient_id
    if (!myPatientId) return

    const ok = await confirm({
      title: "Cancel appointment?",
      description: "Are you sure you want to cancel this appointment?",
      okText: "Yes",
      cancelText: "No",
    })

    if (!ok) return
    toast.promise(updateAppointmentStatus('cancelled', appointmentId, myPatientId, accountId)
      .then(
        (updatedAppt) => {
        
          setMyAppointments([{account_id: accountId, appointments:[updatedAppt]}])
       
          return updatedAppt;
        }
      ), {
      loading: "Cancelling appointment...",
      success: "Appointment cancelled",
      error: "Failed to cancel",
    })
  }

  async function rebookAppointment(appointmentId: string) {
    const appointmentAccount = myAppointments?.find(ma =>
      ma.appointments.some(a => a.id === appointmentId)
    );

    if (!appointmentAccount) return

    const accountId = appointmentAccount.account_id
    const myPatientId = currentUser.patient_id.find(p => p.account_id === accountId)?.patient_id
    if (!myPatientId) return

    const selectedAppointment = appointmentAccount.appointments.find(a => a.id == appointmentId)

    let isStillAvailable = false
    // todos

    if (selectedAppointment) {
      const practitionerRole = selectedAppointment.participant.find(p => p.actor.type == "PractitionerRole")?.actor?.reference?.split('/')?.at(-1)
      if (practitionerRole) {
        const isSlotNotTaken = await isSlotAvailable({ practitionerRole, start: selectedAppointment.start }, accountId)
        if (isSlotNotTaken) {
          isStillAvailable = true
        }
      }
    }


    if (isStillAvailable) {
      const ok = await confirm({
        title: "Book appointment?",
        description: "Are you sure you want to rebook this appointment?",
        okText: "Yes",
        cancelText: "No",
      })

      if (!ok) return
      toast.promise(updateAppointmentStatus('booked', appointmentId, myPatientId, accountId)
        .then(
          (updatedAppt) => {
            setMyAppointments([{account_id: accountId, appointments:[updatedAppt]}])
            return updatedAppt;
          }
        ), {
        loading: "Booking appointment...",
        success: "Appointment booked",
        error: "Failed to book",
      })

    } else {

      const bookNew = await confirm({
        title: "Book New Appointment",
        description: "Slot is already taken, book new appointment?",
        okText: "Yes",
        cancelText: "No",
      })

      if (bookNew) {
        router.push('/health-services/booking')
      }

      return

    }

  }

function setMyAppointments(appointments: Appointments) {
  if (!appointments || !appointments.length) return

  const newAppointments = myAppointments ? [...myAppointments] : []

  appointments.forEach(aptAccount => {
    const aptAccountIndex = newAppointments.findIndex(
      ma => ma.account_id == aptAccount.account_id
    )

    if (aptAccountIndex === -1) {
      newAppointments.push(aptAccount)
      return
    }

    const existingMap = new Map(
      newAppointments[aptAccountIndex].appointments.map(a => [a.id, a])
    )

    aptAccount.appointments.forEach(newApt => {
      const existing = existingMap.get(newApt.id)

      if (existing) {
        Object.assign(existing, newApt)
      } else {
        newAppointments[aptAccountIndex].appointments.push(newApt)
      }
    })
  })

  setMyAppointmentsState(newAppointments)
}



  const creditLimit = currentUser.maxCredit ?? 0
  const creditedAppointments = myAppointments?.filter(apt => JSON.stringify(apt).includes('"code":"booked"'))
  const creditUsed = creditedAppointments?.length ?? 0
  const remainingCredit = myAppointments ? creditLimit - creditUsed : undefined



  return (
    <HalaxyServiceContext.Provider
      value={{
        myAppointments,
        setMyAppointments,
        cancelAppointment,
        rebookAppointment,
        creditLimit,
        creditUsed,
        remainingCredit,
      }}
    >
      {children}

    </HalaxyServiceContext.Provider>
  );
}

export function useHalaxyServiceContext() {
  const context = useContext(HalaxyServiceContext);
  if (!context) {
    throw new Error(
      "useHalaxyServiceContext must be used within a HalaxyServiceContextProvider"
    );
  }
  return context;
}
