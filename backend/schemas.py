from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import List, Optional
from timezone_utils import validate_timezone

class EventCreate(BaseModel):
    name: str
    location: str
    start_time: datetime
    end_time: datetime
    max_capacity: int
    timezone: str = Field(default="IST", description="Timezone for the event (e.g., IST, UTC, EST)")

class EventResponse(BaseModel):
    id: int
    name: str
    location: str
    start_time: datetime
    end_time: datetime
    max_capacity: int
    attendee_count: int = 0
    timezone: str = "IST"
    
    class Config:
        from_attributes = True

class EventWithTimezone(EventResponse):
    """Event response with timezone-converted times."""
    start_time_local: str
    end_time_local: str
    timezone_display: str

class AttendeeCreate(BaseModel):
    name: str
    email: str

class AttendeeResponse(BaseModel):
    id: int
    name: str
    email: str
    event_id: int
    
    class Config:
        from_attributes = True

class EventWithAttendees(EventResponse):
    attendees: List[AttendeeResponse]
