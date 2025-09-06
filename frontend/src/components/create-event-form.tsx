"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UsersIcon,
} from "lucide-react";
import { createEvent, type CreateEventData } from "@/lib/api";
import { toast } from "sonner";
import { DateTimePicker } from "@/components/date-and-time";
import {
  SUPPORTED_TIMEZONES,
  DEFAULT_TIMEZONE,
  getUserTimezone,
  getAbbreviationFromTimezone,
} from "@/lib/timezone-utils";

interface CreateEventFormProps {
  onBack: () => void;
  onEventCreated: () => void;
}

export function CreateEventForm({
  onBack,
  onEventCreated,
}: CreateEventFormProps) {
  const [formData, setFormData] = useState<CreateEventData>({
    name: "",
    location: "",
    start_time: "",
    end_time: "",
    max_capacity: 0,
    timezone: getAbbreviationFromTimezone(getUserTimezone()),
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Event name is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.start_time) {
      newErrors.start_time = "Start time is required";
    }

    if (!formData.end_time) {
      newErrors.end_time = "End time is required";
    }

    if (formData.start_time && formData.end_time) {
      const startDate = new Date(formData.start_time);
      const endDate = new Date(formData.end_time);
      if (endDate <= startDate) {
        newErrors.end_time = "End time must be after start time";
      }
    }

    if (formData.max_capacity <= 0) {
      newErrors.max_capacity = "Capacity must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await createEvent(formData);
      toast.success("Event created successfully!");
      onEventCreated();
    } catch (error) {
      toast.error("Failed to create event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof CreateEventData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="gap-2 bg-transparent"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground text-balance">
              Create New Event
            </h1>
            <p className="text-muted-foreground mt-2">
              Fill in the details to create your event
            </p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Event Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Event Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Event Name *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter event name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4" />
                  Location *
                </Label>
                <Textarea
                  id="location"
                  placeholder="Enter event location or address"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  className={errors.location ? "border-destructive" : ""}
                  rows={2}
                />
                {errors.location && (
                  <p className="text-sm text-destructive">{errors.location}</p>
                )}
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DateTimePicker
                  label="Start Date & Time *"
                  value={formData.start_time}
                  onChange={(value) => handleInputChange("start_time", value)}
                  error={errors.start_time}
                  id="start_time"
                />

                <DateTimePicker
                  label="End Date & Time *"
                  value={formData.end_time}
                  onChange={(value) => handleInputChange("end_time", value)}
                  error={errors.end_time}
                  id="end_time"
                />
              </div>

              {/* Max Capacity */}
              <div className="space-y-2">
                <Label
                  htmlFor="max_capacity"
                  className="flex items-center gap-2"
                >
                  <UsersIcon className="h-4 w-4" />
                  Maximum Capacity *
                </Label>
                <Input
                  id="max_capacity"
                  type="number"
                  min="1"
                  placeholder="Enter maximum number of attendees"
                  value={formData.max_capacity || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "max_capacity",
                      Number.parseInt(e.target.value) || 0
                    )
                  }
                  className={errors.max_capacity ? "border-destructive" : ""}
                />
                {errors.max_capacity && (
                  <p className="text-sm text-destructive">
                    {errors.max_capacity}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  Set the maximum number of people who can register for this
                  event
                </p>
              </div>

              {/* Timezone */}
              <div className="space-y-2">
                <Label htmlFor="timezone" className="flex items-center gap-2">
                  <ClockIcon className="h-4 w-4" />
                  Timezone
                </Label>
                <Select
                  value={formData.timezone || DEFAULT_TIMEZONE}
                  onValueChange={(value) =>
                    handleInputChange("timezone", value)
                  }
                >
                  <SelectTrigger
                    className={errors.timezone ? "border-destructive" : ""}
                  >
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_TIMEZONES.map((tz) => (
                      <SelectItem
                        key={tz.timezone}
                        value={getAbbreviationFromTimezone(tz.timezone)}
                      >
                        {tz.display_name} ({tz.utc_offset})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.timezone && (
                  <p className="text-sm text-destructive">{errors.timezone}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  Select the timezone for this event. All times will be
                  displayed in this timezone.
                </p>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  className="flex-1 bg-transparent"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Creating..." : "Create Event"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
