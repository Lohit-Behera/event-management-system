"use client";

import { useRouter } from "next/navigation";
import { CreateEventForm } from "@/components/create-event-form";

export default function CreateEventPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/");
  };

  const handleEventCreated = () => {
    router.push("/");
  };

  return (
    <CreateEventForm onBack={handleBack} onEventCreated={handleEventCreated} />
  );
}
