"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventCard } from "@/components/event-card";
import { RegisterAttendeeModal } from "@/components/register-attendee-modal";
import {
  PlusIcon,
  CalendarIcon,
  UsersIcon,
  TrendingUpIcon,
} from "lucide-react";
import { type Event, fetchEvents } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ModeToggle } from "@/components/ModeToggle";

export default function Dashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const eventsData = await fetchEvents();
      setEvents(eventsData);
    } catch (error) {
      toast.error("Failed to load events. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (eventId: number) => {
    router.push(`/events/${eventId}`);
  };

  const handleRegisterAttendee = (eventId: number) => {
    const event = events.find((e) => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
      setIsRegistrationModalOpen(true);
    }
  };

  const handleCreateEvent = () => {
    router.push("/create");
  };

  const handleRegistrationSuccess = () => {
    // Reload events to get updated attendee counts
    loadEvents();
  };

  const handleCloseRegistrationModal = () => {
    setIsRegistrationModalOpen(false);
    setSelectedEvent(null);
  };

  // Calculate dashboard stats
  const totalEvents = events.length;
  const totalAttendees = events.reduce(
    (sum, event) => sum + (event.attendee_count || 0),
    0
  );
  const upcomingEvents = events.filter(
    (event) => new Date(event.start_time) > new Date()
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground text-balance">
                Event Management Dashboard
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage your events and track attendee registrations
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleCreateEvent} className="gap-2">
                <PlusIcon className="h-4 w-4" />
                Create Event
              </Button>
              <ModeToggle />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Events
                </CardTitle>
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {totalEvents}
                </div>
                <p className="text-xs text-muted-foreground">All time events</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Attendees
                </CardTitle>
                <UsersIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {totalAttendees}
                </div>
                <p className="text-xs text-muted-foreground">
                  Registered attendees
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Upcoming Events
                </CardTitle>
                <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {upcomingEvents}
                </div>
                <p className="text-xs text-muted-foreground">
                  Events scheduled
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Events Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">
                All Events
              </h2>
              {events.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {events.length} events found
                </p>
              )}
            </div>

            {events.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No events yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Get started by creating your first event
                  </p>
                  <Button onClick={handleCreateEvent} className="gap-2">
                    <PlusIcon className="h-4 w-4" />
                    Create Your First Event
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onViewDetails={handleViewDetails}
                    onRegisterAttendee={handleRegisterAttendee}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      <RegisterAttendeeModal
        event={selectedEvent}
        isOpen={isRegistrationModalOpen}
        onClose={handleCloseRegistrationModal}
        onRegistrationSuccess={handleRegistrationSuccess}
      />
    </>
  );
}
