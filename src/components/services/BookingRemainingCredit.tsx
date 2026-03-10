"use client"

import { useHalaxyServiceContext } from "@/context/HalaxyServiceContext";

const BookingRemainingCredit = () => {
    const {remainingCredit} = useHalaxyServiceContext()
    return (
     <>{remainingCredit ?? "--"}</>
    );
}

export default BookingRemainingCredit;