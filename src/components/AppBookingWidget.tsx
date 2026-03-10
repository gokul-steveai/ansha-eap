"use client";

import { useAppServiceContext } from "@/context/appServiceContext";
import { useHalaxyBookingServiceContext } from "@/context/HalaxyBookingServiceContext";
import { removeUnderscores } from "@/lib/helper";
import { CLINIC_LOCATIONS } from "@/serverActions/halaxy/const";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import PractitionerCard from "./PractitionerCard";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

type TabValue = "online" | "inperson"
export default function AppBookingWidget() {

    const { myCompany } = useAppServiceContext()
    let locationsAvailable = myCompany?.locations ? CLINIC_LOCATIONS.filter(cl => myCompany.locations.includes(cl.value)) : []
    const hasOnlineIndex = locationsAvailable.findIndex(la => la.label.includes("online"));
    let hasOnline: typeof locationsAvailable[0] | undefined;

    if (hasOnlineIndex !== -1) {
        hasOnline = locationsAvailable[hasOnlineIndex];
        locationsAvailable = locationsAvailable.filter(l => !l.label.includes('online'))
    }
    // COLLSTUD
    let defaultOpen: TabValue = hasOnline ? "online" : "inperson"

    if (myCompany) {
        if (myCompany.code == "COLLSTUD") {
            defaultOpen = "inperson"
        }
    }

    const [appointmentType, setAppointmentType] = useState<TabValue>(defaultOpen);
    const [selectedLocation, setSelectedLocation] = useState<string | undefined>(locationsAvailable[0].value);
    const { practitioners, setOrgid, isFetching } = useHalaxyBookingServiceContext()




    const hasAvailable = practitioners?.length ?? 0;

        useEffect(() => {
            const initialOrgId = appointmentType === "online" 
                ? "online" 
                : (selectedLocation || locationsAvailable[0]?.value);
            
            if (initialOrgId) {
                setOrgid(initialOrgId);
            }
        }, []); 
        
    function toggleGroupHandleOnChange(value: TabValue) {
        let orgId = ""

        if (value == "online") {
            orgId = "online"

        } else {

            orgId = selectedLocation ? selectedLocation : locationsAvailable[0]?.value
        }

        setOrgid(orgId)
        return value && setAppointmentType(value)
    }

    return (
        <div className="w-full-sidebar space-y-10">
            {/* MODE + LOCATION FILTER */}
            <div className="max-sm:flex-col flex w-full gap-4">

                {/* Toggle Online / In-person */}
                <ToggleGroup
                    type="single"
                    value={appointmentType}
                    onValueChange={toggleGroupHandleOnChange}
                    className="inline-flex w-full md:max-w-md border-2 border-primary/50 overflow-hidden"
                >
                    <ToggleGroupItem
                        value="online"
                        disabled={!hasOnline}
                        aria-label="Online (Telehealth)"
                        className="bg-white flex-1 text-center px-4 py-2 font-semibold text-primary 
                            data-[state=on]:bg-primary 
                            data-[state=on]:text-white
                            !rounded-none"
                    >
                        Online (Telehealth)
                    </ToggleGroupItem>

                    <ToggleGroupItem
                        value="inperson"
                        aria-label="In-Person"
                        className="bg-white flex-1 text-center px-4 py-2 font-semibold text-primary 
                            data-[state=on]:bg-primary 
                            data-[state=on]:text-white
                            !rounded-none"
                    >
                        In-Person
                    </ToggleGroupItem>
                </ToggleGroup>

                {/* Location dropdown (only for in-person) */}
                {appointmentType === "inperson" && (
                    <Select
                        value={selectedLocation || locationsAvailable[0]?.value}
                        onValueChange={(val) => {
                            setSelectedLocation(val);
                            setOrgid(val);
                        }}
                    >
                        <SelectTrigger className="bg-white w-full md:w-[220px] !px-4 !py-2 !h-auto">
                            <SelectValue placeholder={locationsAvailable?.length ? "Select a location" : "No locations available"} />
                        </SelectTrigger>
                        <SelectContent>
                            {locationsAvailable?.map(location =>
                                <SelectItem className="capitalize" key={location.value} value={location.value}>{removeUnderscores(location.label)}</SelectItem>)

                            }
                        </SelectContent>
                    </Select>
                )}
            </div>

            {/* PRACTITIONER LIST */}
            <div>
                <div className="grid gap-5 gap-y-10 md:grid-cols-[repeat(auto-fit,minmax(400px,1fr))]">
                    {isFetching && <div className="flex flex-row flex-nowrap items-center">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="ml-2">Gathering data...</span>

                    </div>}

                    {!isFetching && hasAvailable === 0 &&
                        <>
                            {selectedLocation ?
                                <span>No Practitioner available</span>
                                :
                                <span>Select a location first</span>
                            }
                        </>
                    }

                    {!isFetching && hasAvailable > 0 && (
                        <>
                            {practitioners?.map((practitioner) => {

                                return <PractitionerCard key={practitioner.id} item={practitioner} />

                            })}

                            {/* Filler grid cells to keep layout aligned */}
                            {practitioners!.length < 3 && (
                                <>
                                    <div></div>
                                    <div></div>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
