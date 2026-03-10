"use server";
import { getHalaxyAccountIdByOrgId } from "./const";
import { halaxyFetch } from "./credentials";
import { OrgId } from "./types";

export type ParticipantStatus = "booked" | "cancelled" | "attended" | "tentative" | "accepted";

export type AppointmentParticipant = {
  type?: {
    coding?: {
      system: string;
      code: string;
      display: string;
    }[];
  }[];
  actor: {
    reference: string; // e.g., "https://au-api.halaxy.com/main/PractitionerRole/PR-3331559"
    type: "PractitionerRole" | "Patient";
  };
  modifierExtension?: {
    url: string;
    valueCoding: {
      system: string;
      code: ParticipantStatus;
      display: string;
    };
  }[];
};

export type AppointmentSupportingInfo = {
  reference: string; // e.g., "https://au-api.halaxy.com/main/HealthcareService/557057"
  type: "HealthcareService";
};

export type FhirAppointment = {
  resourceType: "Appointment";
  id: string;
  start: string; // ISO string
  end: string; // ISO string
  minutesDuration: number;
  created: string;
  participant: AppointmentParticipant[];
  supportingInformation?: AppointmentSupportingInfo[];
  meta: {
    lastUpdated: string;
  };
};


export type AppointmentsResponse = {
  total: number;
  entry: {resource:FhirAppointment}[];
};

type BookAppointmentProps = {
  appointment: FhirAppointment;
  patientId: string;
  serviceId: string;
}
export async function bookAppointment({
appointment,
patientId,
serviceId
}:BookAppointmentProps,accountId:string):Promise<FhirAppointment> {

  return await halaxyFetch("/Appointment/$book", {
    method: "POST",
    payload: {
    resourceType: "Parameters",
    parameter: [
      {
        name: "appt-resource",
        resource: appointment,
      },
      {
        name: "patient-id",
        valueReference: {
          reference: `https://au-api.halaxy.com/main/Patient/${patientId}`, //allaine@aiwebsiteservices.com
          type: "Patient",
        },
      },
      {
        name: "healthcare-service-id",
        valueReference: {
          reference: `https://au-api.halaxy.com/main/HealthcareService/${serviceId}`, //Elevate by ANSA Appointment
          type: "HealthcareService",
        },
      },
      {
        name: "location-type",
        valueCode: "clinic",
      },
      {
        name: "status",
        valueCode: "booked",
      },
      // {
      //   name: "charge-item-definition-id",
      //   valueReference: {
      //     reference: "https://au-api.halaxy.com/main/ChargeItemDefinition/123456",
      //     type: "ChargeItemDefinition",
      //   },
      // },
    ],
  },
  },accountId)


}

export async function getUserAppointments(patient_id: string, accountId:string) {
  const res = await halaxyFetch(`/Appointment?page=1&_count=30&patient=${patient_id}`,{},accountId) as AppointmentsResponse
  if(res.total === 0) return []
  return res.entry.map(i => i.resource)
}


export async function updateAppointmentStatus(
  status: "booked" | "cancelled" | "tentative" | "accepted",
  appointmentId: string,
  patientId: string,
  accountId:string
) {

  const res = await halaxyFetch(`/Appointment/${appointmentId}`, {
    method: "PATCH",
    payload: {
      participant: [
        {
          actor: {
            reference: `https://au-api.halaxy.com/main/Patient/${patientId}`,
            type: "Patient",
          },
          modifierExtension: [
            {
              url: "https://terminology.halaxy.com/StructureDefinition/appointment-participant-status",
              valueCoding: {
                system: "https://au-api.halaxy.com/presets/CodeSystem/appointment-participant-status",
                code: status,
                display: status,
              },
            },
          ],
        },
      ],
      description:
        status === "cancelled"
          ? "Cancelled by patient"
          : status === "booked"
          ? "Rebooked by patient"
          : undefined,
    },
  },accountId);

  return res as FhirAppointment
}

export async function isSlotAvailable({
  practitionerRole,
  start,
}: {
  practitionerRole: string;
  start: string;
},accountId:string): Promise<boolean> {

  const availableSlots = await halaxyFetch(
    `/Appointment?page=1&_count=30&date=${encodeURIComponent(start)}&part-status=booked&practitioner-role=${practitionerRole}`,
    {},
    accountId
  ) as AppointmentsResponse;

  return availableSlots.total === 0 ? true : false;
}


export async function getAvailableAppointments({practitionerRole,start,end,duration}:{practitionerRole: string, start: string, end: string, duration: number}, orgId:OrgId) {
      const accountId = getHalaxyAccountIdByOrgId(orgId)
      const bookedAppointments = await halaxyFetch(
        `/Appointment?page=1&_count=100&part-status=booked&practitioner-role=${practitionerRole}&_sort=date`,
        {},
        accountId
      ) as AppointmentsResponse;

  
      const slots = await halaxyFetch(
    `/Appointment/$find?start=${start}&end=${end}&practitioner-role=${practitionerRole}` +
    `&duration=${duration}` +
    `&apply-buffer-time=true` +
    `&include-overbooked=false`,
    {},
    accountId
  ) as AppointmentsResponse;
  
    if(slots.total === 0) return []

  const availableSlots = slots.entry.filter(slot => {
    const slotResource = slot.resource
    return !bookedAppointments.entry.some(appt => {
      const apptResource = appt.resource
      return (
        new Date(slotResource.start) < new Date(apptResource.end) &&
        new Date(slotResource.end) > new Date(apptResource.start)
      )
    }
    )
  }
  );


    return availableSlots.map(i => i.resource)
    
}