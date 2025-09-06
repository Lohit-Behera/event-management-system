from datetime import datetime
from typing import Optional, List
from dataclasses import dataclass

@dataclass
class Event:
    """Event model for database operations"""
    id: Optional[int] = None
    name: str = ""
    location: str = ""
    start_time: datetime = None
    end_time: datetime = None
    max_capacity: int = 0
    timezone: str = "IST"
    attendee_count: int = 0
    
    @classmethod
    def from_dict(cls, data: dict) -> 'Event':
        """Create Event instance from dictionary (e.g., from database row)"""
        return cls(
            id=data.get('id'),
            name=data.get('name', ''),
            location=data.get('location', ''),
            start_time=data.get('start_time'),
            end_time=data.get('end_time'),
            max_capacity=data.get('max_capacity', 0),
            timezone=data.get('timezone', 'IST'),
            attendee_count=data.get('attendee_count', 0)
        )
    
    def to_dict(self) -> dict:
        """Convert Event instance to dictionary for database operations"""
        return {
            'id': self.id,
            'name': self.name,
            'location': self.location,
            'start_time': self.start_time,
            'end_time': self.end_time,
            'max_capacity': self.max_capacity,
            'timezone': self.timezone,
            'attendee_count': self.attendee_count
        }

@dataclass
class Attendee:
    """Attendee model for database operations"""
    id: Optional[int] = None
    name: str = ""
    email: str = ""
    event_id: int = 0
    
    @classmethod
    def from_dict(cls, data: dict) -> 'Attendee':
        """Create Attendee instance from dictionary (e.g., from database row)"""
        return cls(
            id=data.get('id'),
            name=data.get('name', ''),
            email=data.get('email', ''),
            event_id=data.get('event_id', 0)
        )
    
    def to_dict(self) -> dict:
        """Convert Attendee instance to dictionary for database operations"""
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'event_id': self.event_id
        }