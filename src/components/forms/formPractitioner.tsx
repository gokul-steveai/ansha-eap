"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import "@uploadcare/react-uploader/core.css";
import { FileUploaderRegular } from "@uploadcare/react-uploader/next";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import {
  Practitioner,
  createPractitioner,
  updatePractitioner,
} from "@/serverActions/crudPractitioners";

import {
  EXPERTISE_OPTIONS,
  IDENTIFICATION_OPTIONS,
  LANGUAGE_OPTIONS,
  LOCATIONS_OPTIONS,
  MODALITY_OPTIONS,
  OTHER_SERVICES_OPTIONS,
  PATIENT_FOCUS_OPTIONS,
  PROFESSIONAL_REGISTRATION_OPTIONS,
} from "@/lib/const";
import { optionsToStrings, stringsToOptions } from "@/lib/helper";
import { MultiSelectOption } from "@/types";
import Image from "next/image";
import MultiSelect from "../multiSelect";
import FieldGroup from "../ui/fieldGroup";
import FormDynamicFields from "../ui/formDynamicFields";
import KeyValueInput from "../ui/keyValueInput";


type FormPractitionerProps = {
  practitioner?: Practitioner; // ✅ pass data directly
  onSubmitSuccess?: (practitioner: Practitioner) => void;
  hideSubmitButton?: boolean;
  submitForm?: (submitFn: () => void) => void;
};

export default function FormPractitioner({
  practitioner,
  onSubmitSuccess,
  hideSubmitButton = false,
  submitForm,
}: FormPractitionerProps) {
  const [loading, setLoading] = useState<boolean>(!!practitioner);

  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<Practitioner>({
    defaultValues: {
      first_name: "",
      last_name: "",
      title: "",
      email: "",
      profile_img: "",
      description: "",
      profession: "",
      locations: [],
      clinic: "",
      booking_link: "",
      expertise: [],
      languages: [],
      modalities: [],
      accreditations: [],
      patient_focus: [],
      certifications: [],
      other_services: [],
      qualifications: [],
    },
  });

  const profileImg = watch("profile_img");

  // ✅ Prefill form when practitioner is passed
  useEffect(() => {
    if (practitioner) {
      setLoading(true);
      reset({
        ...practitioner,
        expertise: stringsToOptions(practitioner.expertise, EXPERTISE_OPTIONS) as unknown as string[],
        languages: stringsToOptions(practitioner.languages, LANGUAGE_OPTIONS) as unknown as string[],
        modalities: stringsToOptions(practitioner.modalities, MODALITY_OPTIONS) as unknown as string[],
        locations: stringsToOptions(practitioner.locations, LOCATIONS_OPTIONS) as unknown as string[],
        patient_focus: stringsToOptions(practitioner.patient_focus, PATIENT_FOCUS_OPTIONS) as unknown as string[],
        other_services: stringsToOptions(practitioner.other_services, OTHER_SERVICES_OPTIONS) as unknown as string[],
      });
      setLoading(false);
    }
  }, [practitioner, reset]);

  const onSubmit = async (data: Practitioner) => {
    const formatted = {
      ...data,
      expertise: optionsToStrings(data.expertise as unknown as MultiSelectOption[]),
      languages: optionsToStrings(data.languages as unknown as MultiSelectOption[]),
      locations: optionsToStrings(data.locations as unknown as MultiSelectOption[]),
      modalities: optionsToStrings(data.modalities as unknown as MultiSelectOption[]),
      patient_focus: optionsToStrings(data.patient_focus as unknown as MultiSelectOption[]),
      other_services: optionsToStrings(data.other_services as unknown as MultiSelectOption[]),
    };


    
    try {
      let result;
      if (practitioner?.id) {
        result = await updatePractitioner(practitioner.id, formatted);
      } else {
        result = await createPractitioner(formatted);
      }


      if (result.success && result.data) {
        onSubmitSuccess?.(result.data);

        if (practitioner?.id) {
          reset({
            ...result.data,
            expertise: stringsToOptions(result.data.expertise, EXPERTISE_OPTIONS) as unknown as string[],
            languages: stringsToOptions(result.data.languages, LANGUAGE_OPTIONS) as unknown as string[],
            modalities: stringsToOptions(result.data.modalities, MODALITY_OPTIONS) as unknown as string[],
            locations: stringsToOptions(result.data.locations, LOCATIONS_OPTIONS) as unknown as string[],
            patient_focus: stringsToOptions(result.data.patient_focus, PATIENT_FOCUS_OPTIONS) as unknown as string[],
            other_services: stringsToOptions(result.data.other_services, OTHER_SERVICES_OPTIONS) as unknown as string[],
          });
        } else {
          reset();
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Expose submit function externally
  useEffect(() => {
    if (submitForm) {
      submitForm(() => handleSubmit(onSubmit));
    }
  }, [submitForm, handleSubmit]);

  if (loading) {
    return <p>Loading practitioner...</p>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Profile Image */}
      <div className="form-item flex flex-col items-center gap-3">
        {profileImg ? (
          <Image
            src={profileImg}
            alt="Profile"
            width={200}
            height={200}
            className="w-24 h-24 rounded-full object-cover border"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">
            No Image
          </div>
        )}
        <FileUploaderRegular
          pubkey="927d7568bad196ef7d60"
          multiple={false}
          onCommonUploadSuccess={(e) => {
            const cdnUrl = e.successEntries[0].cdnUrl;
            setValue("profile_img", cdnUrl, { shouldDirty: true });
          }}
        />
      </div>

      {/* Halaxy Details */}
      <FieldGroup label="Halaxy Details">
        <div className="space-y-8">
          <div className="flex flex-row w-full gap-2">
            <Input
              placeholder="Halaxy Id"
              {...register("halaxy_id", { required: true })}
            />
          </div>
        </div>
      </FieldGroup>
      
      {/* Personal Details */}
      <FieldGroup label="Personal Details">
        <div className="space-y-8">
          <div className="flex flex-row w-full gap-2">
            <Input placeholder="Title" {...register("title")} />
            <Input
              placeholder="First name"
              {...register("first_name", { required: true })}
            />
            <Input
              placeholder="Last name"
              {...register("last_name", { required: true })}
            />
          </div>
          <Input
            placeholder="Email"
            {...register("email", { required: true })}
          />
        </div>
      </FieldGroup>

      {/* Qualifications & Credentials */}
      <FieldGroup label="Qualifications & Credentials">
        <div className="space-y-8">
          <Input placeholder="Profession" {...register("profession")} />
          <Textarea placeholder="Professional Description" {...register("description")} />
        </div>

        <div className="space-y-2">
          <label className="form-item-label">Identifications</label>
          <Controller
            control={control}
            name="identifications"
            render={({ field }) => (
              <FormDynamicFields
                addBtn={{
                  text: "ADD IDENTIFICATION",
                  className: "text-[11px] font-[600] text-primary tracking-wider mt-2",
                }}
                formControl={<KeyValueInput options={IDENTIFICATION_OPTIONS} />}
                onChange={field.onChange}
                initialValues={field.value}
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <label className="form-item-label">Professional Registration Number</label>
          <Controller
            control={control}
            name="registrations"
            render={({ field }) => (
              <FormDynamicFields
                addBtn={{
                  text: "ADD REGISTRATION",
                  className: "text-[11px] font-[600] text-primary tracking-wider mt-2",
                }}
                formControl={<KeyValueInput options={PROFESSIONAL_REGISTRATION_OPTIONS} />}
                onChange={field.onChange}
                initialValues={field.value}
              />
            )}
          />
        </div>
      </FieldGroup>

      {/* Expertise & Languages */}
      <FieldGroup label="EXPERTISE & LANGUAGE">
        <div className="space-y-2">
          <Controller
            name="expertise"
            control={control}
            render={({ field }) => (
              <MultiSelect
                placeholder="Expertise"
                options={EXPERTISE_OPTIONS}
                value={(field.value as unknown as MultiSelectOption[]) || []}
                onChange={field.onChange}
              />
            )}
          />
        </div>
        <div className="space-y-2">
          <Controller
            control={control}
            name="languages"
            render={({ field }) => (
              <MultiSelect
                placeholder="Select languages"
                options={LANGUAGE_OPTIONS}
                value={(field.value as unknown as MultiSelectOption[]) || []}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </FieldGroup>

      {/* Other Clinical Credentials */}
      <FieldGroup label="Other Clinical Credentials & Preferences">
        <Input placeholder="Clinic" {...register("clinic")} />
        <Input placeholder="Booking Link" {...register("booking_link")} />
          
        <div className="space-y-2">
          <label className="form-item-label">Locations</label>
          <Controller
            control={control}
            name="locations"
            render={({ field }) => (
              <MultiSelect
                placeholder="Select locations"
                options={LOCATIONS_OPTIONS}
                value={(field.value as unknown as MultiSelectOption[]) || []}
                onChange={field.onChange}
              />
            )}
          />
        </div>



        <div className="space-y-2">
          <label className="form-item-label">Modalities</label>
          <Controller
            control={control}
            name="modalities"
            render={({ field }) => (
              <MultiSelect
                placeholder="Select modalities"
                options={MODALITY_OPTIONS}
                value={(field.value as unknown as MultiSelectOption[]) || []}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <label className="form-item-label">Patient Focus</label>
          <Controller
            control={control}
            name="patient_focus"
            render={({ field }) => (
              <MultiSelect
                placeholder="Select from list"
                options={PATIENT_FOCUS_OPTIONS}
                value={(field.value as unknown as MultiSelectOption[]) || []}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <label className="form-item-label">Other Services</label>
          <Controller
            control={control}
            name="other_services"
            render={({ field }) => (
              <MultiSelect
                placeholder="Select from list"
                options={OTHER_SERVICES_OPTIONS}
                value={(field.value as unknown as MultiSelectOption[]) || []}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </FieldGroup>

      {!hideSubmitButton && (
        <Button className="float-right" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : practitioner?.id ? "Update" : "Create"}
        </Button>
      )}
    </form>
  );
}
