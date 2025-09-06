"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ClockIcon, MapPinIcon, UsersIcon } from "lucide-react";
import type { Event } from "@/lib/api";
import {
  formatDateTimeInTimezone,
  getTimezoneAbbreviation,
} from "@/lib/timezone-utils";

interface EventCardProps {
  event: Event;
  onViewDetails: (eventId: number) => void;
  onRegisterAttendee: (eventId: number) => void;
}

export function EventCard({
  event,
  onViewDetails,
  onRegisterAttendee,
}: EventCardProps) {
  const attendeeCount = event.attendee_count || 0;
  const isFullyBooked = attendeeCount >= event.max_capacity;
  const eventTimezone = event.timezone || "Asia/Kolkata";

  const formatDateTime = (dateString: string) => {
    return formatDateTimeInTimezone(dateString, eventTimezone, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-balance">
            {event.name}
          </CardTitle>
          <Badge variant={isFullyBooked ? "destructive" : "secondary"}>
            {isFullyBooked ? "Full" : "Available"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            <span>
              {formatDateTime(event.start_time)} -{" "}
              {formatDateTime(event.end_time)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ClockIcon className="h-4 w-4" />
            <span>{getTimezoneAbbreviation(eventTimezone)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPinIcon className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <UsersIcon className="h-4 w-4" />
            <span>
              {attendeeCount} / {event.max_capacity} attendees
            </span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(event.id)}
            className="flex-1"
          >
            View Details
          </Button>
          <Button
            size="sm"
            onClick={() => onRegisterAttendee(event.id)}
            disabled={isFullyBooked}
            className="flex-1"
          >
            Register
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
