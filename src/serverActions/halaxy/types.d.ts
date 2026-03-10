export type OrgId = string | null | undefined;


 export type FhirBundle = {
  resourceType: "Bundle";
  id: string;
  type: "searchset";
  timestamp: string;
  total: number;
  link: {
    relation: string;
    url: string;
  }[];
  entry: {
    fullUrl: string;
    resource: FhirHealthcareService;
    search: {
      mode: string;
    };
  }[];
}

export type FhirHealthcareService = {
  resourceType: "HealthcareService";
  id: string;
  active: boolean;
  name: string;
  providedBy: {
    reference: string;
    type: "Organization";
  };
  extension: {
    url: string;
    valueQuantity?: {
      value: number;
      unit: string;
      system: string;
    };
    valueString?: string;
    valueInteger?: number;
  }[];
}
