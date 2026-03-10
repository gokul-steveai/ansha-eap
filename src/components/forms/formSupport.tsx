"use client";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { submitSupportTicket, SupportFormData } from "@/serverActions/submitSupportTicket";
import { Check } from "lucide-react";

type FormSupportProps = {
  hideSubmit?: boolean;
  onSubmittingChange?: (isSubmitting: boolean) => void;
  onSuccessChange?: (success: boolean) => void;
};

export type FormSupportHandle = {
  submit: () => void;
};

const FormSupport = forwardRef<FormSupportHandle, FormSupportProps>(
  ({ hideSubmit, onSubmittingChange, onSuccessChange }, ref) => {
    const [success, setSuccess] = useState(false);
    const [serverError, setServerError] = useState("");

    const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
      reset,
    } = useForm<SupportFormData>({
      defaultValues: {
        name: "",
        email: "",
        company: "",
        message: "",
      },
    });

    useEffect(() => {
      if (onSubmittingChange) {
        onSubmittingChange(isSubmitting);
      }
    }, [isSubmitting, onSubmittingChange]);

    useEffect(() => {
      if (onSuccessChange) {
        onSuccessChange(success);
      }
    }, [success, onSuccessChange]);



    // Handle auto-hiding success message safely
    useEffect(() => {
      if (success) {
        const timer = setTimeout(() => {
          setSuccess(false);
        }, 5000);
        // Cleanup function to prevent memory leaks if component unmounts
        return () => clearTimeout(timer);
      }
    }, [success]);

    const onSubmit = async (data: SupportFormData) => {
      setServerError("");

      try {
        const result = await submitSupportTicket(data);

        if (result.success) {
          setSuccess(true);
          reset();
        } else {
          // Fallback if the server returns failure without throwing
          setServerError(result.error || "Something went wrong. Please try again later.");
        }
      } catch {
        setServerError("Network error. Please try again.");
      }
    };

    // React Hook Form's handleSubmit creates the function that triggers validation & submission
    const submitHandler = handleSubmit(onSubmit);

    useImperativeHandle(ref, () => ({
      submit: submitHandler,
    }));

    return (
      <>
        {success ?
           <div className="p-8 space-y-6  overflow-auto text-center">
                    <h2 className="text-xl font-bold">Your Ticket has Been Submitted!</h2>
                    <p>
                        Support for Elevate is provided during standard business hours. We aim to respond to all support requests within 24 to 48 hours during these times. 

                    </p>
                    <Check
                    className="block mx-auto rounded-full ring-7 text-primary"
                     size={100} />
                </div>
          :
          <form onSubmit={submitHandler} className="space-y-6">
            {/* Success Message UI */}


            {/* Server Error Message UI */}
            {serverError && (
              <div role="alert" className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg border border-red-300">
                {serverError}
              </div>
            )}

            <div className="form-item">
              <label htmlFor="name" className="form-item-label">Name</label>
              <Input
                id="name"
                placeholder="John Doe"
                disabled={isSubmitting}
                {...register("name", { required: "Name is required" })}
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div className="form-item">
              <label htmlFor="email" className="form-item-label">Email Address</label>
              <Input
                id="email"
                placeholder="email@domain.com"
                type="email"
                disabled={isSubmitting}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="form-item">
              <label htmlFor="company" className="form-item-label">Company Name</label>
              <Input
                id="company"
                placeholder="Great Org name"
                disabled={isSubmitting}
                {...register("company", { required: "Company name is required" })}
                aria-invalid={!!errors.company}
              />
              {errors.company && (
                <p className="text-red-500 text-sm mt-1">{errors.company.message}</p>
              )}
            </div>

            <div className="form-item">
              <label htmlFor="message" className="form-item-label">Description of the issue</label>
              <Textarea
                id="message"
                className="min-h-40"
                placeholder="Enter text here..."
                disabled={isSubmitting}
                {...register("message", { required: "Description is required" })}
                aria-invalid={!!errors.message}
              />
              {errors.message && (
                <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
              )}
            </div>

            {/* If hideSubmit is true, we still render a hidden button.
          This ensures pressing "Enter" in an input field still triggers 
          onSubmit, which standard HTML forms require.
        */}
            <Button

              type="submit"
              className={!hideSubmit ? "w-full md:w-[250px] rounded-xl shadow-lg" : "hidden"}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Submit"}
            </Button>
          </form>
        }
      </>
    );
  }
);

FormSupport.displayName = "FormSupport";
export default FormSupport;