"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AttendeeList } from "@/components/attendee-list";
import { RegisterAttendeeModal } from "@/components/register-attendee-modal";
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
  MapPinIcon,
  UsersIcon,
  ClockIcon,
  UserPlusIcon,
} from "lucide-react";
import {
  type Event,
  fetchEventWithAttendees,
  fetchEventWithTimezone,
  fetchSupportedTimezones,
  type EventWithTimezone,
  type TimezoneInfo,
} from "@/lib/api";
import { toast } from "sonner";
import {
  formatDateTimeInTimezone,
  formatDuration,
  getTimezoneAbbreviation,
  getUserTimezone,
  getAbbreviationFromTimezone,
  getTimezoneFromAbbreviation,
} from "@/lib/timezone-utils";

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [eventWithTimezone, setEventWithTimezone] =
    useState<EventWithTimezone | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [selectedTimezone, setSelectedTimezone] = useState<string>(
    getAbbreviationFromTimezone(getUserTimezone())
  );
  const [supportedTimezones, setSupportedTimezones] = useState<TimezoneInfo[]>(
    []
  );
  const [timezoneLoading, setTimezoneLoading] = useState(false);

  const eventId = Number.parseInt(params.id as string);

  useEffect(() => {
    if (eventId) {
      loadEventDetails();
      loadSupportedTimezones();
    }
  }, [eventId]);

  useEffect(() => {
    if (event && selectedTimezone) {
      loadEventWithTimezone();
    }
  }, [event, selectedTimezone]);

  const loadEventDetails = async () => {
    try {
      setLoading(true);
      const eventData = await fetchEventWithAttendees(eventId);
      setEvent(eventData);
    } catch (error) {
      toast.error("Failed to load event details. Please try again.");
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  const loadSupportedTimezones = async () => {
    try {
      const timezones = await fetchSupportedTimezones();
      setSupportedTimezones(timezones);
    } catch (error) {
      console.error("Failed to load supported timezones:", error);
    }
  };

  const loadEventWithTimezone = async () => {
    try {
      setTimezoneLoading(true);
      const eventData = await fetchEventWithTimezone(eventId, selectedTimezone);
      setEventWithTimezone(eventData);
    } catch (error) {
      console.error("Failed to load event with timezone:", error);
    } finally {
      setTimezoneLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/");
  };

  const handleRegister = () => {
    setIsRegistrationModalOpen(true);
  };

  const handleRegistrationSuccess = () => {
    loadEventDetails(); // Reload to get updated attendee list
  };

  const handleCloseRegistrationModal = () => {
    setIsRegistrationModalOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Event not found</h2>
          <p className="text-muted-foreground mb-4">
            The event you're looking for doesn't exist.
          </p>
          <Button onClick={handleBack}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const attendeeCount = event.attendees?.length || 0;
  const isFullyBooked = attendeeCount >= event.max_capacity;
  const spotsLeft = event.max_capacity - attendeeCount;
  const eventTimezone = event.timezone || "Asia/Kolkata";

  const formatDateTime = (dateString: string) => {
    const timezone = getTimezoneFromAbbreviation(selectedTimezone);
    return formatDateTimeInTimezone(dateString, timezone, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (dateString: string) => {
    const timezone = getTimezoneFromAbbreviation(selectedTimezone);
    return formatDateTimeInTimezone(dateString, timezone, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDuration = () => {
    return formatDuration(event.start_time, event.end_time);
  };

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
              className="gap-2 bg-transparent"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>

          {/* Event Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground text-balance mb-2">
                  {event.name}
                </h1>
                <div className="flex items-center gap-2">
                  <Badge variant={isFullyBooked ? "destructive" : "secondary"}>
                    {isFullyBooked ? "Fully Booked" : "Available"}
                  </Badge>
                  {!isFullyBooked && (
                    <Badge variant="outline">{spotsLeft} spots remaining</Badge>
                  )}
                </div>
              </div>
              <Button
                onClick={handleRegister}
                disabled={isFullyBooked}
                className="gap-2"
              >
                <UserPlusIcon className="h-4 w-4" />
                {isFullyBooked ? "Event Full" : "Register Now"}
              </Button>
            </div>

            {/* Timezone Selector */}
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <ClockIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">View times in:</span>
              </div>
              <Select
                value={selectedTimezone}
                onValueChange={setSelectedTimezone}
                disabled={timezoneLoading}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {supportedTimezones.map((tz) => (
                    <SelectItem
                      key={tz.timezone}
                      value={getAbbreviationFromTimezone(tz.timezone)}
                    >
                      {tz.display_name} ({tz.utc_offset})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {timezoneLoading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              )}
            </div>
          </div>

          {/* Event Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Date & Time */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CalendarIcon className="h-5 w-5" />
                  Date & Time
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Start</p>
                  <p className="font-medium">
                    {formatDateTime(event.start_time)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">End</p>
                  <p className="font-medium">
                    {formatDateTime(event.end_time)}
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t">
                  <ClockIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Duration: {getDuration()}
                  </span>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t">
                  <span className="text-sm text-muted-foreground">
                    Timezone: {selectedTimezone}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPinIcon className="h-5 w-5" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground whitespace-pre-wrap">
                  {event.location}
                </p>
              </CardContent>
            </Card>

            {/* Capacity */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <UsersIcon className="h-5 w-5" />
                  Capacity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Registered</p>
                  <p className="text-2xl font-bold text-primary">
                    {attendeeCount}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Maximum</p>
                  <p className="text-lg font-semibold">{event.max_capacity}</p>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(attendeeCount / event.max_capacity) * 100}%`,
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Attendee List */}
          <AttendeeList
            attendees={event.attendees || []}
            maxCapacity={event.max_capacity}
          />
        </div>
      </div>

      {/* Registration Modal */}
      <RegisterAttendeeModal
        event={event}
        isOpen={isRegistrationModalOpen}
        onClose={handleCloseRegistrationModal}
        onRegistrationSuccess={handleRegistrationSuccess}
      />
    </>
  );
}
