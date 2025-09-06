import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreateEventForm } from "@/components/create-event-form";
import * as api from "@/lib/api";

// Mock the API
jest.mock("@/lib/api", () => ({
  createEvent: jest.fn(),
}));

const mockOnBack = jest.fn();
const mockOnEventCreated = jest.fn();

describe("CreateEventForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders form fields correctly", () => {
    render(
      <CreateEventForm
        onBack={mockOnBack}
        onEventCreated={mockOnEventCreated}
      />
    );

    expect(screen.getByLabelText(/event name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/end date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/maximum capacity/i)).toBeInTheDocument();
  });

  it("validates required fields", async () => {
    const user = userEvent.setup();
    render(
      <CreateEventForm
        onBack={mockOnBack}
        onEventCreated={mockOnEventCreated}
      />
    );

    const submitButton = screen.getByText("Create Event");
    await user.click(submitButton);

    expect(screen.getByText("Event name is required")).toBeInTheDocument();
    expect(screen.getByText("Location is required")).toBeInTheDocument();
    expect(screen.getByText("Start time is required")).toBeInTheDocument();
    expect(screen.getByText("End time is required")).toBeInTheDocument();
    expect(
      screen.getByText("Capacity must be greater than 0")
    ).toBeInTheDocument();
  });

  it("validates end time is after start time", async () => {
    const user = userEvent.setup();
    render(
      <CreateEventForm
        onBack={mockOnBack}
        onEventCreated={mockOnEventCreated}
      />
    );

    // Fill in valid data but with end time before start time
    await user.type(screen.getByLabelText(/event name/i), "Test Event");
    await user.type(screen.getByLabelText(/location/i), "Test Location");
    await user.type(screen.getByLabelText(/maximum capacity/i), "100");

    const submitButton = screen.getByText("Create Event");
    await user.click(submitButton);

    expect(
      screen.getByText("End time must be after start time")
    ).toBeInTheDocument();
  });

  it("submits form with valid data", async () => {
    const user = userEvent.setup();
    const mockCreateEvent = api.createEvent as jest.MockedFunction<
      typeof api.createEvent
    >;
    mockCreateEvent.mockResolvedValueOnce({
      id: 1,
      name: "Test Event",
      location: "Test Location",
      start_time: "2024-06-15T09:00:00",
      end_time: "2024-06-15T17:00:00",
      max_capacity: 100,
      attendee_count: 0,
    });

    render(
      <CreateEventForm
        onBack={mockOnBack}
        onEventCreated={mockOnEventCreated}
      />
    );

    // Fill in form data
    await user.type(screen.getByLabelText(/event name/i), "Test Event");
    await user.type(screen.getByLabelText(/location/i), "Test Location");
    await user.type(screen.getByLabelText(/maximum capacity/i), "100");

    const submitButton = screen.getByText("Create Event");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockCreateEvent).toHaveBeenCalledWith({
        name: "Test Event",
        location: "Test Location",
        start_time: "",
        end_time: "",
        max_capacity: 100,
      });
    });
  });

  it("calls onBack when back button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <CreateEventForm
        onBack={mockOnBack}
        onEventCreated={mockOnEventCreated}
      />
    );

    const backButton = screen.getByText("Back to Dashboard");
    await user.click(backButton);

    expect(mockOnBack).toHaveBeenCalled();
  });

  it("calls onBack when cancel button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <CreateEventForm
        onBack={mockOnBack}
        onEventCreated={mockOnEventCreated}
      />
    );

    const cancelButton = screen.getByText("Cancel");
    await user.click(cancelButton);

    expect(mockOnBack).toHaveBeenCalled();
  });

  it("handles API errors gracefully", async () => {
    const user = userEvent.setup();
    const mockCreateEvent = api.createEvent as jest.MockedFunction<
      typeof api.createEvent
    >;
    mockCreateEvent.mockRejectedValueOnce(new Error("API Error"));

    render(
      <CreateEventForm
        onBack={mockOnBack}
        onEventCreated={mockOnEventCreated}
      />
    );

    // Fill in form data
    await user.type(screen.getByLabelText(/event name/i), "Test Event");
    await user.type(screen.getByLabelText(/location/i), "Test Location");
    await user.type(screen.getByLabelText(/maximum capacity/i), "100");

    const submitButton = screen.getByText("Create Event");
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Failed to create event. Please try again.")
      ).toBeInTheDocument();
    });
  });
});
