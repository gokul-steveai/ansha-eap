"use server";

import { elevateOrgId } from "./config";
import { getHalaxyAccountIdByOrgId } from "./const";
import { halaxyFetch } from "./credentials";

interface FhirPractitioner {
  id: string;
  resourceType: "Practitioner";
  active?: boolean;
  name?: { use?: string; text?: string; family?: string; given?: string[] }[];
  telecom?: { system: string; value: string; use?: string }[];
  qualification?: {
    code?: {
      coding?: { system: string; code: string; display: string }[];
      text?: string;
    };
  }[];
}

interface FhirPractitionerRole {
  id: string;
  resourceType: "PractitionerRole";
  practitioner: { reference: string; type: string };
}

interface PractitionerListResponse {
  resourceType: "Bundle";
  entry: { resource: FhirPractitioner | FhirPractitionerRole }[];
  total?: number;
}

// Your simplified type
export type HalaxyPractitioner = {
  id: string;        // Practitioner ID
  roleId: string;    // PractitionerRole ID
  orgId: string;
  firstName: string;
  lastName: string;
  email: string;
  profession: string;
}

export async function getHalaxyPractitioners(orgId = elevateOrgId): Promise<HalaxyPractitioner[]> {
  const account_id = getHalaxyAccountIdByOrgId(orgId)

  const res = await halaxyFetch(
    `/PractitionerRole?page=1&_count=100&organization=${orgId}&_include=PractitionerRole%3Apractitioner`
  ,{},account_id) as PractitionerListResponse;

  if (res.total === 0) return [];

  // Separate PractitionerRole and Practitioner
  const roles: FhirPractitionerRole[] = [];
  const practitioners: Record<string, FhirPractitioner> = {};

  for (const entry of res.entry) {
    if (entry.resource.resourceType === "PractitionerRole") {
      roles.push(entry.resource as FhirPractitionerRole);
    } else if (entry.resource.resourceType === "Practitioner") {
      const p = entry.resource as FhirPractitioner;
      practitioners[p.id] = p;
    }
  }

  // Map roles to HalaxyPractitioner
  const mapped: HalaxyPractitioner[] = roles.map(role => {
    const practitioner = practitioners[role.practitioner.reference.split("/").pop()!];
    const practitionerFromPractitionerRole = role.practitioner;

    const practitionerId = practitionerFromPractitionerRole.reference.split("/").pop()?.split('-').pop() || "";
    const firstName = practitioner?.name?.[0]?.given?.[0] || "";
    const lastName = practitioner?.name?.[0]?.family || "";
    const email = practitioner?.telecom?.find(t => t.system === "email")?.value || "";
    const profession = practitioner?.qualification?.[0]?.code?.coding?.[0]?.display || "";

    return {
      id: practitionerId,
      roleId: role.id,
      orgId,
      firstName,
      lastName,
      email,
      profession,
    };
  }).filter(Boolean) as HalaxyPractitioner[];

  return mapped;
}


