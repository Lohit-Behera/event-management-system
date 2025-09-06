const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export interface Event {
  id: number;
  name: string;
  location: string;
  start_time: string;
  end_time: string;
  max_capacity: number;
  attendee_count: number;
  timezone?: string;
  attendees?: Attendee[];
}

export interface EventWithTimezone extends Event {
  start_time_local: string;
  end_time_local: string;
  timezone_display: string;
}

export interface Attendee {
  id: number;
  name: string;
  email: string;
  event_id: number;
}

export interface CreateEventData {
  name: string;
  location: string;
  start_time: string;
  end_time: string;
  max_capacity: number;
  timezone?: string;
}

export interface RegisterAttendeeData {
  name: string;
  email: string;
}

export interface TimezoneInfo {
  timezone: string;
  display_name: string;
  utc_offset: string;
}

export interface AttendeeCount {
  event_id: number;
  total_attendees: number;
}

// Event API functions
export async function fetchEvents(): Promise<Event[]> {
  const response = await fetch(`${API_BASE_URL}/events`);
  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }
  return response.json();
}

export async function createEvent(eventData: CreateEventData): Promise<Event> {
  const response = await fetch(`${API_BASE_URL}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(eventData),
  });

  if (!response.ok) {
    throw new Error("Failed to create event");
  }
  return response.json();
}

export async function fetchEventWithAttendees(eventId: number): Promise<Event> {
  const response = await fetch(`${API_BASE_URL}/events/${eventId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch event details");
  }
  return response.json();
}

export async function registerAttendee(
  eventId: number,
  attendeeData: RegisterAttendeeData
): Promise<Attendee> {
  const response = await fetch(`${API_BASE_URL}/events/${eventId}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(attendeeData),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to register attendee");
  }
  return response.json();
}

export async function fetchEventAttendees(
  eventId: number
): Promise<Attendee[]> {
  const response = await fetch(`${API_BASE_URL}/events/${eventId}/attendees`);
  if (!response.ok) {
    throw new Error("Failed to fetch attendees");
  }
  return response.json();
}

// Timezone-related API functions
export async function fetchEventWithTimezone(
  eventId: number,
  timezone: string = "IST"
): Promise<EventWithTimezone> {
  const response = await fetch(
    `${API_BASE_URL}/events/${eventId}/timezone?timezone=${encodeURIComponent(
      timezone
    )}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch event with timezone");
  }
  return response.json();
}

export async function fetchAttendeeCount(
  eventId: number
): Promise<AttendeeCount> {
  const response = await fetch(
    `${API_BASE_URL}/events/${eventId}/attendees/count`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch attendee count");
  }
  return response.json();
}

export async function fetchSupportedTimezones(): Promise<TimezoneInfo[]> {
  const response = await fetch(`${API_BASE_URL}/timezones`);
  if (!response.ok) {
    throw new Error("Failed to fetch supported timezones");
  }
  return response.json();
}
