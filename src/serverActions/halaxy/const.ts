import { OrgId } from "./types";

export type OrgKeys = keyof typeof orgIds;
export type OrgIds = {
    online_realworld: string;
    online_ballarat:string;
    online_melton: string;
    bacchus_marsh: string;
    geelong: string;
    collarts: string;
    ballarat: string;
    melton: string;
    cranbourne: string;
}

type HalaxyAccount = {
    account_id: string;
    account_name: string;
    client_id: string;
    client_secret: string;
    orgIds: Partial<Record<OrgKeys, string>>
} 

export const halaxyAccounts:HalaxyAccount[] = [
    {
        account_id: "7c06ce128f",
        account_name: "Realworld Psychology",
        client_id: "7c06ce128f43f8f18395664f8ef62636",
        client_secret: "4fe1540ac6ad2132d28aa9ff38854d9e0e95462eaecea7905146b41939f2180ceed6a0de84995c4b442fae5d67e3e8fe3ef3c6e89240a6063a707f8555c588a5",
        orgIds: {
            online_realworld: 'CL-1335519',
            bacchus_marsh: 'CL-615081',
            geelong: 'CL-1334751',
            collarts: 'CL-1325373',
        }
    },
    {
        account_id: "5e048d8260",
        account_name: "Ballarat Psychology Clinic",
        client_id: "5e048d8260281c14a17bc4801a4ab424",
        client_secret: "e750aed87f9d6e4819b01524bb82ae67a2f72b287b09665463fe6d9dc26ffc3852fc56c97ba98f6156973c7f1a2d809983c24c9e32e5bfa432554e79ca6c2546",
        orgIds: {
            online_ballarat: "CL-1339731",
            ballarat: "CL-732291",
            
        }
    },
    {
        account_id: "8740909025",
        account_name: "Melton Psychology Clinic",
        client_id: "874090902549dc3373ed80f6a8c2e253",
        client_secret: "2f841c8780eccd592a33b7ffb12309d16470c970486f1f63d6c6fbdee844fa443e7eaa730a187acad797d3849ae969d81f42d264eb77c4c96f767d2cd6ff5447",
        orgIds: {
            online_melton: "CL-1340369",
            melton: "CL-1279641"
        }
    },
    {
        account_id: "4efb2f0fd6",
        account_name: "Ansa Health Cranbourne",
        client_id: "4efb2f0fd67ec1b2a975cbe0f90c0aab",
        client_secret: "69f51aeb55b98c0e933fb43b4cb30676f0d8203b6d9e369d0df606cb9d0212c0bbb2e1930cad7d8cd5456f51e48db885049acfd9c3c4090fa5eeed28739891bf",
        orgIds: {
            cranbourne: "CL-1340401"
        }
    },
];


export const CLINIC_LOCATIONS = halaxyAccounts.flatMap(account =>
    Object.entries(account.orgIds).map(([key, value]) => ({ label: key, value }))
  );

export const orgIds:OrgIds = halaxyAccounts.filter(account =>
    account.orgIds && Object.keys(account.orgIds).length > 0
).reduce((acc, account) => ({ ...acc, ...account.orgIds }), {} as OrgIds)

export const ONLINE_ORG_IDS = CLINIC_LOCATIONS.filter(l => l.label.includes("online")).map(l => l.value)

export function getAccountIndexByOrgId(orgId:OrgId) {
    if (!orgId) return 0
    return halaxyAccounts.findIndex(account => JSON.stringify(account.orgIds).includes(orgId)) || 0
}
export function getHalaxyAccountIdByOrgId(orgId:OrgId) {
    if (!orgId) return undefined
    return halaxyAccounts.find(account => JSON.stringify(account.orgIds).includes(orgId))?.account_id
}