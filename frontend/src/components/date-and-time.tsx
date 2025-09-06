"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateTimePickerProps {
  value?: string; // ISO string
  onChange?: (value: string) => void; // ISO string
  error?: string;
  label?: string;
  id?: string;
  className?: string;
}

export function DateTimePicker({
  value,
  onChange,
  error,
  label = "Date & Time",
  id,
  className = "",
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);

  // Parse the ISO string to get date and time components
  const dateValue = value ? new Date(value) : undefined;
  const timeValue = value
    ? new Date(value).toTimeString().slice(0, 8)
    : "09:00:00";

  const handleDateChange = (selectedDate: Date | undefined) => {
    if (selectedDate && onChange) {
      // Combine the selected date with the current time or default time
      const currentTime = timeValue || "09:00:00";
      const [hours, minutes, seconds] = currentTime.split(":");
      const newDateTime = new Date(selectedDate);
      newDateTime.setHours(
        parseInt(hours),
        parseInt(minutes),
        parseInt(seconds)
      );
      onChange(newDateTime.toISOString());
      setOpen(false);
    }
  };

  const handleTimeChange = (timeString: string) => {
    if (onChange) {
      const currentDate = dateValue || new Date();
      const [hours, minutes, seconds] = timeString.split(":");
      const newDateTime = new Date(currentDate);
      newDateTime.setHours(
        parseInt(hours),
        parseInt(minutes),
        parseInt(seconds)
      );
      onChange(newDateTime.toISOString());
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id} className="px-1">
        {label}
      </Label>
      <div className="flex gap-4">
        <div className="flex flex-col gap-3">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-32 justify-between font-normal ${
                  error ? "border-destructive" : ""
                }`}
              >
                {dateValue ? dateValue.toLocaleDateString() : "Select date"}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={dateValue}
                captionLayout="dropdown"
                onSelect={handleDateChange}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex flex-col gap-3">
          <Input
            type="time"
            step="1"
            value={timeValue}
            onChange={(e) => handleTimeChange(e.target.value)}
            className={`bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none ${
              error ? "border-destructive" : ""
            }`}
          />
        </div>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

// Keep the original component for backward compatibility
export function Calendar24() {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-3">
        <Label htmlFor="date-picker" className="px-1">
          Date
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              className="w-32 justify-between font-normal"
            >
              {date ? date.toLocaleDateString() : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={(date: Date | undefined) => {
                setDate(date);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-3">
        <Label htmlFor="time-picker" className="px-1">
          Time
        </Label>
        <Input
          type="time"
          id="time-picker"
          step="1"
          defaultValue="10:30:00"
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  );
}
