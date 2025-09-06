import {
  fetchEvents,
  createEvent,
  fetchEventWithAttendees,
  registerAttendee,
  fetchEventAttendees,
} from "@/lib/api";

// Mock fetch globally
global.fetch = jest.fn();

describe("API Functions", () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  describe("fetchEvents", () => {
    it("should fetch events successfully", async () => {
      const mockEvents = [
        {
          id: 1,
          name: "Test Event",
          location: "Test Location",
          start_time: "2024-06-15T09:00:00",
          end_time: "2024-06-15T17:00:00",
          max_capacity: 100,
          attendee_count: 5,
        },
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockEvents,
      });

      const result = await fetchEvents();

      expect(fetch).toHaveBeenCalledWith("http://localhost:8000/events");
      expect(result).toEqual(mockEvents);
    });

    it("should throw error when fetch fails", async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(fetchEvents()).rejects.toThrow("Failed to fetch events");
    });
  });

  describe("createEvent", () => {
    it("should create event successfully", async () => {
      const eventData = {
        name: "New Event",
        location: "New Location",
        start_time: "2024-06-15T09:00:00",
        end_time: "2024-06-15T17:00:00",
        max_capacity: 100,
      };

      const mockResponse = {
        id: 1,
        ...eventData,
        attendee_count: 0,
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await createEvent(eventData);

      expect(fetch).toHaveBeenCalledWith("http://localhost:8000/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });
      expect(result).toEqual(mockResponse);
    });

    it("should throw error when creation fails", async () => {
      const eventData = {
        name: "New Event",
        location: "New Location",
        start_time: "2024-06-15T09:00:00",
        end_time: "2024-06-15T17:00:00",
        max_capacity: 100,
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(createEvent(eventData)).rejects.toThrow(
        "Failed to create event"
      );
    });
  });

  describe("registerAttendee", () => {
    it("should register attendee successfully", async () => {
      const attendeeData = {
        name: "John Doe",
        email: "john@example.com",
      };

      const mockResponse = {
        id: 1,
        ...attendeeData,
        event_id: 1,
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await registerAttendee(1, attendeeData);

      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:8000/events/1/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(attendeeData),
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it("should throw error when registration fails", async () => {
      const attendeeData = {
        name: "John Doe",
        email: "john@example.com",
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        text: async () => "Email already registered",
      });

      await expect(registerAttendee(1, attendeeData)).rejects.toThrow(
        "Email already registered"
      );
    });
  });

  describe("fetchEventWithAttendees", () => {
    it("should fetch event with attendees successfully", async () => {
      const mockEvent = {
        id: 1,
        name: "Test Event",
        location: "Test Location",
        start_time: "2024-06-15T09:00:00",
        end_time: "2024-06-15T17:00:00",
        max_capacity: 100,
        attendee_count: 2,
        attendees: [
          {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            event_id: 1,
          },
        ],
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockEvent,
      });

      const result = await fetchEventWithAttendees(1);

      expect(fetch).toHaveBeenCalledWith("http://localhost:8000/events/1");
      expect(result).toEqual(mockEvent);
    });
  });

  describe("fetchEventAttendees", () => {
    it("should fetch event attendees successfully", async () => {
      const mockAttendees = [
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          event_id: 1,
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane@example.com",
          event_id: 1,
        },
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockAttendees,
      });

      const result = await fetchEventAttendees(1);

      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:8000/events/1/attendees"
      );
      expect(result).toEqual(mockAttendees);
    });
  });
});
