import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UsersIcon, MailIcon } from "lucide-react";
import type { Attendee } from "@/lib/api";

interface AttendeeListProps {
  attendees: Attendee[];
  maxCapacity: number;
}

export function AttendeeList({ attendees, maxCapacity }: AttendeeListProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const spotsLeft = maxCapacity - attendees.length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <UsersIcon className="h-5 w-5" />
            Registered Attendees
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {attendees.length} / {maxCapacity}
            </Badge>
            {spotsLeft > 0 && (
              <Badge variant="outline">{spotsLeft} spots left</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {attendees.length === 0 ? (
          <div className="text-center py-8">
            <UsersIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No attendees yet</h3>
            <p className="text-muted-foreground">
              Be the first to register for this event!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {attendees.map((attendee) => (
              <div
                key={attendee.id}
                className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {getInitials(attendee.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-card-foreground truncate">
                    {attendee.name}
                  </p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MailIcon className="h-3 w-3" />
                    <span className="truncate">{attendee.email}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
