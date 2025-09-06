from database import db
from models import Event, Attendee
from schemas import EventCreate, AttendeeCreate
from datetime import datetime
from timezone_utils import convert_to_utc, validate_timezone
from typing import Tuple, Optional, List
import logging

logger = logging.getLogger(__name__)

async def create_event(event: EventCreate) -> Event:
    """Create a new event"""
    # Validate timezone
    if not validate_timezone(event.timezone):
        raise ValueError(f"Invalid timezone: {event.timezone}")
    
    # Convert times to UTC for storage
    start_time_utc = convert_to_utc(event.start_time, event.timezone)
    end_time_utc = convert_to_utc(event.end_time, event.timezone)
    
    with db.get_cursor() as cursor:
        cursor.execute("""
            INSERT INTO events (name, location, start_time, end_time, max_capacity, timezone)
            VALUES (%(name)s, %(location)s, %(start_time)s, %(end_time)s, %(max_capacity)s, %(timezone)s)
            RETURNING id, name, location, start_time, end_time, max_capacity, timezone
        """, {
            'name': event.name,
            'location': event.location,
            'start_time': start_time_utc,
            'end_time': end_time_utc,
            'max_capacity': event.max_capacity,
            'timezone': event.timezone
        })
        
        result = cursor.fetchone()
        return Event.from_dict(dict(result))

async def get_events(skip: int = 0, limit: int = 100) -> List[Event]:
    """Get all events with pagination"""
    with db.get_cursor() as cursor:
        cursor.execute("""
            SELECT e.*, 
                   COALESCE(COUNT(a.id), 0) as attendee_count
            FROM events e
            LEFT JOIN attendees a ON e.id = a.event_id
            GROUP BY e.id, e.name, e.location, e.start_time, e.end_time, e.max_capacity, e.timezone
            ORDER BY e.start_time DESC
            OFFSET %(skip)s LIMIT %(limit)s
        """, {'skip': skip, 'limit': limit})
        
        results = cursor.fetchall()
        events = []
        for row in results:
            event_data = dict(row)
            events.append(Event.from_dict(event_data))
        
        return events

async def get_event(event_id: int) -> Optional[Event]:
    """Get a specific event by ID"""
    with db.get_cursor() as cursor:
        cursor.execute("""
            SELECT e.*, 
                   COALESCE(COUNT(a.id), 0) as attendee_count
            FROM events e
            LEFT JOIN attendees a ON e.id = a.event_id
            WHERE e.id = %(event_id)s
            GROUP BY e.id, e.name, e.location, e.start_time, e.end_time, e.max_capacity, e.timezone
        """, {'event_id': event_id})
        
        result = cursor.fetchone()
        if result:
            return Event.from_dict(dict(result))
        return None

async def create_attendee(attendee: AttendeeCreate, event_id: int) -> Tuple[Optional[Attendee], Optional[str]]:
    """Create a new attendee for an event"""
    # Check if event exists
    event = await get_event(event_id)
    if not event:
        return None, "Event not found"
    
    # Check if email already registered for this event
    with db.get_cursor() as cursor:
        cursor.execute("""
            SELECT id FROM attendees 
            WHERE email = %(email)s AND event_id = %(event_id)s
        """, {'email': attendee.email, 'event_id': event_id})
        
        existing_attendee = cursor.fetchone()
        if existing_attendee:
            return None, "Email already registered for this event"
        
        # Check capacity
        cursor.execute("""
            SELECT COUNT(*) as count FROM attendees 
            WHERE event_id = %(event_id)s
        """, {'event_id': event_id})
        
        current_attendees = cursor.fetchone()['count']
        if current_attendees >= event.max_capacity:
            return None, "Event is at maximum capacity"
        
        # Create attendee
        cursor.execute("""
            INSERT INTO attendees (name, email, event_id)
            VALUES (%(name)s, %(email)s, %(event_id)s)
            RETURNING id, name, email, event_id
        """, {
            'name': attendee.name,
            'email': attendee.email,
            'event_id': event_id
        })
        
        result = cursor.fetchone()
        return Attendee.from_dict(dict(result)), None

async def get_attendees(event_id: int, skip: int = 0, limit: int = 100) -> List[Attendee]:
    """Get attendees for an event with pagination"""
    with db.get_cursor() as cursor:
        cursor.execute("""
            SELECT id, name, email, event_id
            FROM attendees 
            WHERE event_id = %(event_id)s
            ORDER BY id
            OFFSET %(skip)s LIMIT %(limit)s
        """, {'event_id': event_id, 'skip': skip, 'limit': limit})
        
        results = cursor.fetchall()
        attendees = []
        for row in results:
            attendees.append(Attendee.from_dict(dict(row)))
        
        return attendees

async def get_attendees_count(event_id: int) -> int:
    """Get total count of attendees for an event"""
    with db.get_cursor() as cursor:
        cursor.execute("""
            SELECT COUNT(*) as count FROM attendees 
            WHERE event_id = %(event_id)s
        """, {'event_id': event_id})
        
        result = cursor.fetchone()
        return result['count']