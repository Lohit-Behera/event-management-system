# Event Management System - Backend

A FastAPI-based backend for managing events and attendee registrations with comprehensive timezone support.

## Features

### Core Event Management

- Create events with name, location, start/end times, and max capacity
- List all upcoming events with pagination
- Register attendees for events
- Prevent overbooking and duplicate registrations
- View attendee lists for each event with pagination

### Advanced Timezone Support

- **8 Supported Timezones**: IST, UTC, EST, PST, GMT, CET, JST, AEST
- **Automatic UTC Conversion**: All times stored in UTC for consistency
- **Real-time Conversion**: Convert event times to any supported timezone
- **Timezone Validation**: Ensure only supported timezones are used
- **Dynamic Offset Calculation**: Handle DST changes automatically

### Pagination & Performance

- Efficient pagination for large attendee lists
- Attendee count endpoints for pagination metadata
- Optimized database queries with proper indexing

## Setup

1. Install dependencies:

```bash
pip install -r requirements.txt
```

2. Set up PostgreSQL database and update the DATABASE_URL in `config.py` or create a `.env` file:

```
DATABASE_URL=postgresql://username:password@localhost:5432/event_management
```

3. Run the application:

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Event Management

- `POST /events` - Create a new event with timezone support
- `GET /events` - List all upcoming events with pagination
- `GET /events/{event_id}` - Get event details with attendees
- `GET /events/{event_id}/timezone` - Get event with timezone conversion

### Attendee Management

- `POST /events/{event_id}/register` - Register an attendee for an event
- `GET /events/{event_id}/attendees` - Get attendees with pagination
- `GET /events/{event_id}/attendees/count` - Get total attendee count

### Timezone Management

- `GET /timezones` - Get list of supported timezones
- `GET /` - API health check

### Timezone Examples

#### Create Event with Timezone

```bash
curl -X POST "http://localhost:8000/events" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Global Tech Summit",
    "location": "Virtual Event",
    "start_time": "2024-06-15T09:00:00",
    "end_time": "2024-06-15T17:00:00",
    "max_capacity": 1000,
    "timezone": "IST"
  }'
```

#### Get Event in Different Timezone

```bash
# Get event times in EST
curl -X GET "http://localhost:8000/events/1/timezone?timezone=EST"

# Get event times in PST
curl -X GET "http://localhost:8000/events/1/timezone?timezone=PST"
```

#### Get Supported Timezones

```bash
curl -X GET "http://localhost:8000/timezones"
```

## API Documentation

Once the server is running, visit:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
