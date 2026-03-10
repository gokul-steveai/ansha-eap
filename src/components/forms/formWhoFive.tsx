"use client";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAppServiceContext } from "@/context/appServiceContext";
import { createWHO5Response, getWHO5ResponsesByUser } from "@/serverActions/crudWho5";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Intro from "../intro/Intro";

type WHO5Form = {
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q5: number;
};

const who5Questions = [
  { id: "q1", text: "I have felt cheerful and in good spirits" },
  { id: "q2", text: "I have felt calm and relaxed" },
  { id: "q3", text: "I have felt active and vigorous" },
  { id: "q4", text: "I woke up feeling fresh and rested" },
  { id: "q5", text: "My daily life has been filled with things that interest me" },
];

const responseScale = [
  { label: "All of the time", value: 5 },
  { label: "Most of the time", value: 4 },
  { label: "More than half of the time", value: 3 },
  { label: "Less than half of the time", value: 2 },
  { label: "Some of the time", value: 1 },
  { label: "At no time", value: 0 },
];

export default function WHO5FormComponent() {
  const { currentUser } = useAppServiceContext();
  const [isComplete, setIsComplete] = useState(false)
  const { update } = useSession();
  const CURRENT_USER_ID = currentUser?.id;

  const {
    handleSubmit,
    control,
    reset,
    setError,
    clearErrors,
    formState: { isSubmitting, errors },
  } = useForm<WHO5Form>()

useEffect(() => {
  const fetchData = async () => {
    if (!CURRENT_USER_ID) return;
    const whoFiveRes = await getWHO5ResponsesByUser(CURRENT_USER_ID);
    const data = whoFiveRes.data || null;
    if (data) {
      // Pre-fill form
      reset({
        q1: data.q1,
        q2: data.q2,
        q3: data.q3,
        q4: data.q4,
        q5: data.q5,
      });
    }
  };

  fetchData();
}, [CURRENT_USER_ID, reset]);


  const onSubmit = async (data: WHO5Form) => {
    if (!CURRENT_USER_ID) return;

    // Check all questions answered
    const unanswered = who5Questions.filter(
      (q) => data[q.id as keyof WHO5Form] === undefined
    );
    if (unanswered.length > 0) {
      setError("root", {
        type: "manual",
        message: "Please answer all questions before submitting.",
      });
      return;
    }
    clearErrors("root");

    // Submit directly in q1…q5 format
    const res = await createWHO5Response({
      user_id: CURRENT_USER_ID,
      q1: data.q1,
      q2: data.q2,
      q3: data.q3,
      q4: data.q4,
      q5: data.q5,
    });

    if(res.success){
      await update({ who5Completed: true });
      reset();
      setIsComplete(true)
    }
    
  };

  
  return (<>
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-4 border rounded-lg bg-white"
    >
      <h2 className="text-xl font-semibold text-center">
        The World Health Organization-Five Well-Being Index (WHO-5)
      </h2>
      <p className="text-sm font-medium text-muted-foreground mb-4 text-center">
        Please indicate for each statement which is closest to how you have been
        feeling over the last two weeks. Higher numbers mean better well-being.
      </p>

      <div className="overflow-x-auto">
        <table className="min-w-lg w-full border-collapse border text-sm">
          <thead>
            <tr>
              <th className="border px-4 py-2 text-left w-[250px]">Question</th>
              {responseScale.map((opt) => (
                <th
                  key={opt.value}
                  className="border px-2 py-2 text-center align-middle w-[80px]"
                >
                  <div className="flex flex-col items-center justify-center">
                    <span className="font-medium">{opt.value}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {opt.label}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {who5Questions.map((q, idx) => (
              <tr key={q.id} className="odd:bg-gray-50">
                <td className="border px-4 py-2 font-medium align-middle">
                  {idx + 1}. {q.text}
                </td>
                {responseScale.map((opt) => (
              
                  <td
                  key={opt.value}
                    className="relative border px-2 py-2 text-center align-middle"
                  >
                        
                    <Controller
                      name={q.id as keyof WHO5Form}
                      control={control}
                      render={({ field }) => (
                        <RadioGroup
                          onValueChange={(val) => field.onChange(Number(val))}
                          value={field.value?.toString()}
                          className="flex items-center justify-center"
                        >
                          <RadioGroupItem
                            value={opt.value.toString()}
                            id={`${q.id}-${opt.value}`}
                          />
                       
                        </RadioGroup>
                      )}
                    />
                    <label
                   className="absolute top-0 left-0 h-full w-full cursor-pointer"
                    htmlFor={`${q.id}-${opt.value}`}>
                    </label>
                  </td>
                  
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* One global error outside the table */}
      {errors.root && (
        <p className="text-red-500 text-sm font-medium text-center">
          {errors.root.message}
        </p>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </form>
      {isComplete && 
        <Intro/>
      }
  </>
  );
}
