"use server"

import { authTokenUrl, baseUrl } from "./config";
import { halaxyAccounts } from "./const";


type Token = {
  account_id: string;
  cachedToken: string | null;
  cachedTokenExpiry: number | null;
}

const tokens: Token[] = []


export async function getAccessToken(account_id: string = "7c06ce128f"): Promise<string | null> {
  const halaxyAccount = halaxyAccounts.find(account => account.account_id === account_id);
  if(!halaxyAccount) return null

  const now = Date.now();
  const token = tokens.find(t => t.account_id === account_id);
  const cachedToken = token?.cachedToken;
  const cachedTokenExpiry = token?.cachedTokenExpiry;
  
  if (cachedToken && cachedTokenExpiry && now < cachedTokenExpiry) {
    return cachedToken;
  }

  const clientId = halaxyAccount.client_id;
  const clientSecret = halaxyAccount.client_secret;

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch(authTokenUrl, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
  });

  if (!res.ok) {
    throw new Error(`Failed to get token: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  const tokenIndex = tokens.findIndex(t => t.account_id === account_id);
  if (tokenIndex === -1) {
    tokens.push({ account_id, cachedToken: null, cachedTokenExpiry: null });
  } else {
    tokens[tokenIndex].cachedToken = data.access_token;
    tokens[tokenIndex].cachedTokenExpiry = now + (data.expires_in - 60) * 1000;
  }  

  console.log(tokens, 'tokens')

  return data.access_token;
}


export async function halaxyFetch(endpoint: string, options: {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  payload?: unknown
} = {}, account_id?:string) {
  const token = await getAccessToken(account_id);
  let contentType = 'application/json'

  if (options.method == "PATCH") {
    contentType = 'application/merge-patch+json'
  }


  const res = await fetch(`${baseUrl}${endpoint}`, {
    method: options.method ?? "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Accept": "application/fhir+json",
      "Content-Type": contentType,
    },
    body: options.payload ? JSON.stringify(options.payload) : undefined,
  });



  if (!res.ok) {
    throw new Error(`Halaxy API error: ${res.status} ${await res.text()}`);
  }

  return res.json();
}