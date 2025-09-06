import { render, screen, fireEvent } from "@testing-library/react";
import { EventCard } from "@/components/event-card";
import type { Event } from "@/lib/api";

const mockEvent: Event = {
  id: 1,
  name: "Test Event",
  location: "Test Location",
  start_time: "2024-06-15T09:00:00",
  end_time: "2024-06-15T17:00:00",
  max_capacity: 100,
  attendee_count: 25,
};

const mockOnViewDetails = jest.fn();
const mockOnRegisterAttendee = jest.fn();

describe("EventCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders event information correctly", () => {
    render(
      <EventCard
        event={mockEvent}
        onViewDetails={mockOnViewDetails}
        onRegisterAttendee={mockOnRegisterAttendee}
      />
    );

    expect(screen.getByText("Test Event")).toBeInTheDocument();
    expect(screen.getByText("Test Location")).toBeInTheDocument();
    expect(screen.getByText("25 / 100")).toBeInTheDocument();
  });

  it("calls onViewDetails when View Details button is clicked", () => {
    render(
      <EventCard
        event={mockEvent}
        onViewDetails={mockOnViewDetails}
        onRegisterAttendee={mockOnRegisterAttendee}
      />
    );

    const viewDetailsButton = screen.getByText("View Details");
    fireEvent.click(viewDetailsButton);

    expect(mockOnViewDetails).toHaveBeenCalledWith(1);
  });

  it("calls onRegisterAttendee when Register button is clicked", () => {
    render(
      <EventCard
        event={mockEvent}
        onViewDetails={mockOnViewDetails}
        onRegisterAttendee={mockOnRegisterAttendee}
      />
    );

    const registerButton = screen.getByText("Register");
    fireEvent.click(registerButton);

    expect(mockOnRegisterAttendee).toHaveBeenCalledWith(1);
  });

  it("displays correct capacity information", () => {
    const eventWithFullCapacity: Event = {
      ...mockEvent,
      attendee_count: 100,
      max_capacity: 100,
    };

    render(
      <EventCard
        event={eventWithFullCapacity}
        onViewDetails={mockOnViewDetails}
        onRegisterAttendee={mockOnRegisterAttendee}
      />
    );

    expect(screen.getByText("100 / 100")).toBeInTheDocument();
  });

  it("formats date correctly", () => {
    render(
      <EventCard
        event={mockEvent}
        onViewDetails={mockOnViewDetails}
        onRegisterAttendee={mockOnRegisterAttendee}
      />
    );

    // Check if the date is displayed (format may vary based on implementation)
    expect(screen.getByText(/June 15, 2024/)).toBeInTheDocument();
  });
});
