"use client";

import { getPractitioners, Practitioner } from "@/serverActions/crudPractitioners";
import { ONLINE_ORG_IDS } from "@/serverActions/halaxy/const";
import { getHalaxyPractitioners, HalaxyPractitioner } from "@/serverActions/halaxy/practitioners";
import { OrgId } from "@/serverActions/halaxy/types";
import {
    createContext,
    Dispatch,
    SetStateAction,
    useContext,
    useEffect,
    useState
} from "react";
import { useAppServiceContext } from "./appServiceContext";


type BookingHalaxyPractitioners = Record<string, HalaxyPractitioner[]> | null
type HalaxyBookingServiceContextType = {
    orgId: OrgId;
    setOrgid: Dispatch<SetStateAction<OrgId>>;
    setConsentAgreed: Dispatch<SetStateAction<boolean>>;
    consentAgreed: boolean;
    halaxyPractitioners: BookingHalaxyPractitioners;
    practitioners: Practitioner[] | null;
    isFetching: boolean;

};

type HalaxyBookingServiceContextProviderProps = {
    children?: React.ReactNode;
};

const HalaxyBookingServiceContext = createContext<HalaxyBookingServiceContextType | null>(null);

export function HalaxyBookingServiceContextProvider({
    children
}: HalaxyBookingServiceContextProviderProps) {
    const { currentUser, myCompany } = useAppServiceContext();
    const [halaxyPractitioners, setHalaxyPractitioners] = useState<BookingHalaxyPractitioners>(null)
    const [orgId, setOrgid] = useState<OrgId>(null)
    const [companyPractitioners, setCompanyPractitioners] = useState<Practitioner[] | null>(null)
    const [practitioners, setPractitioners] = useState<Practitioner[] | null>(null);
    const [consentAgreed, setConsentAgreed] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    

    useEffect(() => {
        if(!currentUser || !myCompany) return
        async function fetchData() {
            setIsFetching(true)
            try {

                const [practitionersRes, ...halaxyResultsRaw] = await Promise.all([
                    getPractitioners(),
                    ...ONLINE_ORG_IDS.map(orgId => getHalaxyPractitioners(orgId))
                ]);

                const halaxyPractionersRes = halaxyResultsRaw.flat();
                let filteredHalaxyPractitioners = halaxyPractionersRes

                const companyResData = myCompany
                if (practitionersRes.success && companyResData) {
                    
                    const practitionersResData = practitionersRes.data
                    const companyPractitioners = practitionersResData?.filter((p) =>
                        companyResData.practitioners.includes(p.id)
                    );

                    filteredHalaxyPractitioners = halaxyPractionersRes.filter(hp => companyResData.locations.includes(hp.orgId))

                    setCompanyPractitioners(companyPractitioners || null)

                    const filteredPracs: Practitioner[] = companyPractitioners
                        ?.map(p => {
                            const halaxyPractitioner = filteredHalaxyPractitioners.find(hp => hp.email === p.email)
                            if (!halaxyPractitioner) return null // skip if not found

                            return {
                                ...p,
                                booking_link: `/health-services/booking/${halaxyPractitioner.roleId}`
                            } as Practitioner
                        })
                        .filter(Boolean) as Practitioner[]; // remove nulls

                    setPractitioners(filteredPracs || []);
                }
                setHalaxyPractitioners({ online: filteredHalaxyPractitioners });

            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setIsFetching(false)
            }
        }

        fetchData();
    }, [currentUser, myCompany]);


    useEffect(() => {
        async function fetchData() {
            if (!orgId || !myCompany) {
                setPractitioners([])
                return
            }
            try {
                setIsFetching(true)

                let halaxyPractitionersRes: HalaxyPractitioner[]
                
                if (halaxyPractitioners && halaxyPractitioners[orgId]) {
                    halaxyPractitionersRes = halaxyPractitioners[orgId]
                } else {

                    if (orgId == "online") {

                        const results = await Promise.all(
                            ONLINE_ORG_IDS.map(orgId => getHalaxyPractitioners(orgId))
                        )

                        halaxyPractitionersRes = results.flat()

                    } else {

                        halaxyPractitionersRes = await getHalaxyPractitioners(orgId)

                    }

                }

                const filteredHalaxyPractitionersRes = halaxyPractitionersRes.filter(hp => myCompany.locations.includes(hp.orgId))

                setHalaxyPractitioners(prev => ({ ...prev, [orgId]: filteredHalaxyPractitionersRes }));

                const filteredPracs: Practitioner[] = companyPractitioners
                    ?.map(p => {

                        const halaxyPractitioner = filteredHalaxyPractitionersRes.find(hp => {
                            return hp.email === p.email || hp.id === p.halaxy_id;
                        })
                        if (!halaxyPractitioner) return null // skip if not found

                        return {
                            ...p,
                            booking_link: `/health-services/booking/${halaxyPractitioner.roleId}`
                        } as Practitioner
                    })
                    .filter(Boolean) as Practitioner[]; // remove nulls

                setPractitioners(filteredPracs)

            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setIsFetching(false)
            }
        }

        fetchData();

    }, [orgId, myCompany])


    return (
        <HalaxyBookingServiceContext.Provider
            value={{
                orgId,
                setOrgid,
                halaxyPractitioners,
                practitioners,
                consentAgreed,
                setConsentAgreed,
                isFetching

            }}
        >
            {children}
        </HalaxyBookingServiceContext.Provider>
    );
}

export function useHalaxyBookingServiceContext() {
    const context = useContext(HalaxyBookingServiceContext);
    if (!context) {
        throw new Error(
            "useHalaxyBookingServiceContext must be used within a HalaxyBookingServiceContextProvider"
        );
    }
    return context;
}
