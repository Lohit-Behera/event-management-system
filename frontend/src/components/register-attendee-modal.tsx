"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  UserPlusIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UsersIcon,
} from "lucide-react";
import {
  registerAttendee,
  type RegisterAttendeeData,
  type Event,
} from "@/lib/api";
import { toast } from "sonner";
import {
  formatDateTimeInTimezone,
  getTimezoneAbbreviation,
} from "@/lib/timezone-utils";

interface RegisterAttendeeModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onRegistrationSuccess: () => void;
}

export function RegisterAttendeeModal({
  event,
  isOpen,
  onClose,
  onRegistrationSuccess,
}: RegisterAttendeeModalProps) {
  const [formData, setFormData] = useState<RegisterAttendeeData>({
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!event || !validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await registerAttendee(event.id, formData);
      toast.success(`You have been registered for ${event.name}`);

      // Reset form
      setFormData({ name: "", email: "" });
      setErrors({});
      onRegistrationSuccess();
      onClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to register for event";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof RegisterAttendeeData,
    value: string
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

  const handleClose = () => {
    if (!loading) {
      setFormData({ name: "", email: "" });
      setErrors({});
      onClose();
    }
  };

  if (!event) return null;

  const attendeeCount = event.attendees?.length || 0;
  const spotsLeft = event.max_capacity - attendeeCount;

  const formatDateTime = (dateTime: string) => {
    const eventTimezone = event?.timezone || "Asia/Kolkata";
    return formatDateTimeInTimezone(dateTime, eventTimezone, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlusIcon className="h-5 w-5" />
            Register for Event
          </DialogTitle>
          <DialogDescription>
            Fill in your details to register for this event
          </DialogDescription>
        </DialogHeader>

        {/* Event Summary */}
        <div className="bg-card rounded-lg p-4 space-y-2 text-sm">
          <h4 className="font-semibold text-card-foreground">{event.name}</h4>
          <div className="space-y-1 text-muted-foreground">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>{formatDateTime(event.start_time)}</span>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4" />
              <span>
                {getTimezoneAbbreviation(event.timezone || "Asia/Kolkata")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPinIcon className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <UsersIcon className="h-4 w-4" />
              <span>{spotsLeft} spots remaining</span>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="attendee-name">Full Name *</Label>
            <Input
              id="attendee-name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={errors.name ? "border-destructive" : ""}
              disabled={loading}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="attendee-email">Email Address *</Label>
            <Input
              id="attendee-email"
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={errors.email ? "border-destructive" : ""}
              disabled={loading}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
            <p className="text-xs text-muted-foreground">
              You'll receive confirmation details at this email
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 bg-transparent"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Registering..." : "Register Now"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
