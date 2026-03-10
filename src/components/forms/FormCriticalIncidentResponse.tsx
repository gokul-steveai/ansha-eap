"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { sendMail } from "@/lib/email/elasticemail";
import { CRITICAL_INCIDENT_TEMPLATE } from "@/lib/email/email_templates/CriticalIncidentResponseTemplate";

type ContactFormData = {
  name: string;
  organisation: string;
  typeOfIncident: string;
  contactPhone: string;
  bestTimeToCall: string;
  message?: string;
};

export default function FormCriticalIncidentResponse() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactFormData>();
  const [success, setSuccess] = useState(false);

  const onSubmit = async (data: ContactFormData) => {
    try {
        const payload = {
            to: "elevate@ansahealth.com", // Replace with your Elevate email
            subject: `⚠️ Critical Incident: ${data.typeOfIncident}`,
            htmlBody: CRITICAL_INCIDENT_TEMPLATE(data),
    };

      await sendMail(payload);
      setSuccess(true);
      reset();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>Name</label>
        <Input {...register("name", { required: "Name is required" })} />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      <div>
        <label>Organisation</label>
        <Input {...register("organisation", { required: "Organisation is required" })} />
        {errors.organisation && <p className="text-red-500 text-sm">{errors.organisation.message}</p>}
      </div>

      <div>
        <label>Type of Incident</label>
        <Input {...register("typeOfIncident", { required: "Type of Incident is required" })} />
        {errors.typeOfIncident && <p className="text-red-500 text-sm">{errors.typeOfIncident.message}</p>}
      </div>

      <div>
        <label>Contact Phone Number</label>
        <Input {...register("contactPhone", { required: "Contact phone is required" })} />
        {errors.contactPhone && <p className="text-red-500 text-sm">{errors.contactPhone.message}</p>}
      </div>

      <div>
        <label>Best Time to Call</label>
        <Input {...register("bestTimeToCall")} />
      </div>

      <div>
        <label>Message</label>
        <Textarea {...register("message")} placeholder="Optional message..." />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send"}
      </Button>

      {success && <p className="text-green-500">Your message has been sent!</p>}
    </form>
  );
}
