"use client";

import { Button } from "@/components/ui/button";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { addDays, addWeeks, format, isSameDay, isValid, min, startOfWeek, subWeeks } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "./ui/scroll-area";

interface AppointmentPickerProps {
    className?: string;
    availableTimestamps: number[]; // timestamps of available times
    onSelect?: (date: Date) => void;
}

export default function AppointmentPicker({ className, availableTimestamps, onSelect }: AppointmentPickerProps) {
    const [currentWeekStart, setCurrentWeekStart] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 0 }));
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const nextWeek = () => setCurrentWeekStart(prev => addWeeks(prev, 1));
    const prevWeek = () => setCurrentWeekStart(prev => subWeeks(prev, 1));

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        onSelect?.(date);
    };

    // Generate days for current week
    const daysOfWeek = Array.from({ length: 7 }).map((_, i) => addDays(currentWeekStart, i));

    const getDayAvailability = (day: Date) => {
        return availableTimestamps.filter(ts => isSameDay(new Date(ts), day));
    };
const goToNextAvailable = () => {
    // 1. Convert and filter out invalid dates immediately
    const futureTimes = availableTimestamps
        .map(ts => new Date(ts))
        .filter(date => {
            const isDateValid = isValid(date);
            const isFuture = !selectedDate || date.getTime() > selectedDate.getTime();
            return isDateValid && isFuture;
        });

    // 2. Safeguard against empty arrays to prevent 'Invalid Date' from min()
    if (futureTimes.length > 0) {
        const nextAvailable = min(futureTimes);

        // 3. Ensure we have a valid result before updating state
        if (isValid(nextAvailable)) {
            const weekStart = startOfWeek(nextAvailable, { weekStartsOn: 0 });
            setCurrentWeekStart(weekStart);
            handleDateSelect(nextAvailable);
        }
    } else {
        console.warn("No valid future timestamps available.");
    }
};

    

    return (
        <div className={cn("bg-white p-4 rounded-md", className)}>
            {/* Navigation */}
            <div className="flex justify-between items-center mb-4 space-x-2">
                <div className="flex flex-row flex-nowrap items-center">
                    <Button variant="ghost" size="icon" onClick={prevWeek}>
                        <ChevronLeft size={16} />
                    </Button>
                    {/* Calendar picker with label and icon */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" className="max-md:!p-0 flex items-center gap-2">
                               {`${format(currentWeekStart, "MMM dd")} - ${format(addDays(currentWeekStart, 6), "dd")}`}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-2">
                            <Calendar
                                mode="single"
                                selected={selectedDate || currentWeekStart}
                                onSelect={(date) => {
                                    if (date) setCurrentWeekStart(startOfWeek(date, { weekStartsOn: 0 }));
                                }}
                                components={{
                                    DayButton: (props) => {
                                        const day = props.day;
                                        const hasAvailable = day && availableTimestamps.some(ts => isSameDay(new Date(ts), day.date));

                                        // Merge your conditional className with existing one
                                        const newClassName = hasAvailable && !props.modifiers.selected ? "bg-blue-100" : ""
                                        return <CalendarDayButton {...props} className={cn("ring-2 ring-inset ring-white", props.className, newClassName)} />;
                                    },
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                    <Button variant="ghost" size="icon" onClick={nextWeek}>
                        <ChevronRight size={16} />
                    </Button>
                </div>
                <Button
                className="max-md:text-xs max-md:!p-2 h-fit"
                variant="outline"
                onClick={goToNextAvailable}>Next Available</Button>
            </div>

            {/* Week grid */}
            <div className="overflow-auto grid grid-cols-[repeat(7,minmax(100px,1fr))] gap-2">
                {daysOfWeek.map((day) => {
                    const dayAvailableTimes = getDayAvailability(day);
                    return (
                        <div key={day.toISOString()} className="flex flex-col items-center p-2">
                            <div className="text-sm text-center mb-2">
                                <span>{format(day, "EEE")}</span>
                                <br />
                                <span>{format(day, "dd MMM")}</span>
                            </div>
                            <ScrollArea className="h-[300px] max-h-[200px] md:max-h-[300px] overflow-auto ">
                                <div className="flex flex-col flex-nowrap gap-2">
                                    {dayAvailableTimes.length ? (
                                        dayAvailableTimes.map((ts) => (
                                            <Button
                                                type="button"
                                                key={ts}
                                                variant="ghost"
                                                className={cn(
                                                    "!py-2 !px-4 text-sm bg-blue-50",
                                                    selectedDate && selectedDate.getTime() === ts && "text-white bg-primary"
                                                )}
                                                onClick={() => handleDateSelect(new Date(ts))}
                                            >
                                                {format(new Date(ts), "hh:mm a")}
                                            </Button>
                                        ))
                                    ) : (
                                        <p className="text-gray-400 text-sm">Unavailable</p>
                                    )}
                                </div>
                            </ScrollArea>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
