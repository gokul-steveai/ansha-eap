"use server"
import { getHalaxyAccountIdByOrgId } from './const';
import { halaxyFetch } from "./credentials";
import { FhirBundle, FhirHealthcareService, OrgId } from './types';


export async function getHalaxyServices(orgId: OrgId): Promise<FhirHealthcareService[]> {
  const accountId = getHalaxyAccountIdByOrgId(orgId)
  const res = await halaxyFetch(`/HealthcareService?page=1&_count=30&active=true&name=elevate`,{},accountId) as FhirBundle
  if(res.total === 0) return []
  return res.entry.map(i => i.resource) 
}