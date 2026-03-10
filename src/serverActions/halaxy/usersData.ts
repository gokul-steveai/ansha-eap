"use server";

import { getUserAppointments } from "./appointments";

export async function getMyAppointments(patientId: string, accountId: string) {
  if(!patientId){
    return null
  }
  const res = await getUserAppointments(patientId,accountId);
  return res;
}

