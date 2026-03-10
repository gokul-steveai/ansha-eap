"use client";

import { Button } from "@/components/ui/button";
import MoodStatement from "@/components/ui/moodStatement";
import { Slider } from "@/components/ui/slider";
import { useAppServiceContext } from "@/context/appServiceContext";
import { DAILY_CHECKINS_QUESTIONS } from "@/lib/const";
import { getDailyCheckinsOverall } from "@/lib/helper";
import { cn } from "@/lib/utils";
import { DailyCheckIn as DailyCheckinType } from "@/types";
import { useEffect, useRef, useState } from "react";

type DailyCheckInProps = {
  isFocused: boolean;
  focusOnChange?: (value: boolean) => void; // <-- the setter function type
};
export default function DailyCheckIn({
  isFocused = false,
  focusOnChange,
}: DailyCheckInProps) {
  const didInitRef = useRef(false);
  const { saveDailyCheckIns, currentUser, dailyCheckIns } =
    useAppServiceContext();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>(
    Array(DAILY_CHECKINS_QUESTIONS.length).fill(3)
  );

  const entryToday = getEntryToday(dailyCheckIns);

  const handleSliderChange = (value: number[]) => {
    const updated = [...answers];
    updated[step] = value[0];
    setAnswers(updated);
  };

  const next = () => {
    if (step < DAILY_CHECKINS_QUESTIONS.length - 1) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async () => {
    const formData = DAILY_CHECKINS_QUESTIONS.map((q, index) => {
      return {
        question_id: q.id,
        answer: answers[index],
      };
    });

    saveDailyCheckIns(formData)
      .then((r) => {
        console.log(r);
      })
      .catch((err) => console.log(err));
  };

  const STORAGE_KEY_SKIP = "daily_checkin_skip";
  const SKIP_DURATION = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
  function removeFocused() {
    if (focusOnChange) {
      focusOnChange(false);
    }
    // save snooze timestamp
    localStorage.setItem(
      STORAGE_KEY_SKIP,
      JSON.stringify({ until: Date.now() + SKIP_DURATION })
    );
  }

  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;

    if (!entryToday) {
      const raw = localStorage.getItem(STORAGE_KEY_SKIP);
      let snoozed = false;

      if (raw) {
        try {
          const { until } = JSON.parse(raw) as { until: number };
          if (Date.now() < until) {
            snoozed = true; // still within 5 mins snooze
          } else {
            localStorage.removeItem(STORAGE_KEY_SKIP); // expired snooze
          }
        } catch {
          localStorage.removeItem(STORAGE_KEY_SKIP);
        }
      }

      if (!snoozed) {
        if (focusOnChange) {
          focusOnChange(true);
        }
      } else {
        if (focusOnChange) {
          focusOnChange(false);
        }
      }
    }
  }, [entryToday, focusOnChange]);

  const todayOverall = entryToday
    ? getDailyCheckinsOverall(entryToday.responses)
    : null;
  return (
    <div className="w-full flex flex-row">
      {!entryToday && (
        <>
          <div className="md:min-w-[300px] pr-10">
            <h1 className="text-3xl">Hi {currentUser?.first_name},</h1>
            <p className="text-lg mb-4">
              {DAILY_CHECKINS_QUESTIONS[step].question}
            </p>
            {isFocused && (
              <Button
                onClick={removeFocused}
                size="sm"
                className="absolute bottom-6 !ring-1 ring-white opacity-80 hover:opacity-100 bg-transparent text-white hover:text-white"
                variant="outline"
              >
                Do it later
              </Button>
            )}
          </div>
          <div className="md:w-full">
            <div className="flex flex-row gap-10">
              <div className="flex-1 formItem">
                <div className="mb-2 text-sm flex flex-row w-full">
                  <p>{DAILY_CHECKINS_QUESTIONS[step].labels.min}</p>
                  <p className="ml-auto">
                    {DAILY_CHECKINS_QUESTIONS[step].labels.max}
                  </p>
                </div>
       <div className="relative mb-1 mt-3 h-6">
                <div className="absolute w-full top-0 flex-nowrap flex flex-row px-1 text-xs text-gray-500">
                     <div
                        key={DAILY_CHECKINS_QUESTIONS[step].min + "default"}
                        className="w-0 text-sm text-background"
                      >
                        <span>{DAILY_CHECKINS_QUESTIONS[step].min}</span>
                        {/* <div className="h-3 w-[1px] bg-white mb-[2px]" /> */}
                      </div>
                    <div className="w-full grid grid-cols-4 justify-between">
                                       {Array.from({ length: DAILY_CHECKINS_QUESTIONS[step].max - 1 }, (_, i) => i + 1).map((n) => {
                    const currentNum = n + DAILY_CHECKINS_QUESTIONS[step].min;

                    return (
                      <div
                        key={currentNum}
                        className="text-end text-sm text-background"
                      >
                        <span className="-translate-x-1/2 absolute">{currentNum}</span>
                        {/* <div className="h-3 w-[1px] bg-white mb-[2px]" /> */}
                      </div>
                    );
                  })}
                    </div>
       
                </div>
              </div>
                <Slider
                  value={[answers[step]]}
                  onValueChange={handleSliderChange}
                  min={DAILY_CHECKINS_QUESTIONS[step].min}
                  max={DAILY_CHECKINS_QUESTIONS[step].max}
                  step={1}
                  className="mb-2 ring-white"
                  rangeClassName={DAILY_CHECKINS_QUESTIONS[step].rangeClassName}
                  thumbClassName={cn(
                    DAILY_CHECKINS_QUESTIONS[step].thumbClassName,
                    "!h-6 !w-6"
                  )}
                  trackClassName="!h-3"
                />
              </div>

              <div className="flex gap-2 flex-col justify-end">
                <p className="text-xs w-fit mx-auto">
                  {step + 1}/{DAILY_CHECKINS_QUESTIONS.length}{" "}
                  <span>Questions</span>
                </p>

                {step < DAILY_CHECKINS_QUESTIONS.length - 1 ? (
                  <Button
                    variant="secondary"
                    onClick={next}
                    className="bg-white text-primary rounded-xl !py-[3px] min-w-[11ch]"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    onClick={handleSubmit}
                    className="bg-white text-primary rounded-xl !py-[3px] min-w-[11ch]"
                  >
                    Submit
                  </Button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
      {entryToday && <MoodStatement percentage={todayOverall?.percentage} />}
    </div>
  );
}

function getEntryToday(entries: DailyCheckinType[]): DailyCheckinType | null {
  if (!entries.length) return null;

  const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

  const found = entries.find((entry) => {
    const entryDate = new Date(entry.created_at).toISOString().split("T")[0];
    return entryDate === today;
  });

  return found ?? null;
}
