"use client"

import { useState } from "react";
import { ConsentForm } from "./forms/consentForm";
import HalaxyBookingIframe from "./ui/HalaxyBookingIframe";

const BookingWidget = ({link}:{link:string}) => {
  const [agreed, setAgreed] = useState(false);
  return (
    <>
      {agreed ? (
        <HalaxyBookingIframe link={link}/>
      ) : (
        <div className="card">
            <h2 className="mb-5">Please read and agree to consent form to proceed with booking.</h2>
          <ConsentForm onSubmit={(v) => setAgreed(v)} />
        </div>
      )}
    </>
  );
};

export default BookingWidget;
