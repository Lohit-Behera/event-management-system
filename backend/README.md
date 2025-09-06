# Event Management System - Backend

A FastAPI-based backend for managing events and attendee registrations with comprehensive timezone support and direct PostgreSQL connectivity.

## 🌐 Live Demo

- **Backend API**: [https://event-management-system-blush-five.vercel.app](https://event-management-system-blush-five.vercel.app)
- **Frontend App**: [https://event-management-system-ifab.vercel.app](https://event-management-system-ifab.vercel.app)
- **API Documentation**: [https://event-management-system-blush-five.vercel.app/docs](https://event-management-system-blush-five.vercel.app/docs)

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

### Database & Performance

- **Direct PostgreSQL Connection**: Using psycopg2 for optimal performance
- **Connection Pooling**: Efficient database connection management
- **Efficient pagination** for large attendee lists
- **Attendee count endpoints** for pagination metadata
- **Optimized database queries** with proper indexing
- **Health monitoring** with comprehensive database status checks

## Setup

1. Install dependencies:

```bash
pip install -r requirements.txt
```

2. Set up PostgreSQL database and create a `.env` file with your database credentials:

```env
user=your_username
password=your_password
host=localhost
port=5432
dbname=event_management
```

3. Run the application:

```bash
python main.py
```

The API will be available at `http://localhost:8000`

**Note**: Database tables are created automatically on startup.

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

### Health & Monitoring

- `GET /` - API root endpoint
- `GET /health` - Basic API health check (no database required)
- `GET /health/db` - Database connection health check with detailed information
- `GET /health/full` - Comprehensive health check including API and database status

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

#### Health Check Examples

```bash
# Basic API health check
curl -X GET "https://event-management-system-blush-five.vercel.app/health"

# Database connection health check
curl -X GET "https://event-management-system-blush-five.vercel.app/health/db"

# Full system health check
curl -X GET "https://event-management-system-blush-five.vercel.app/health/full"
```

## API Documentation

- **Live API Docs**: [https://event-management-system-blush-five.vercel.app/docs](https://event-management-system-blush-five.vercel.app/docs)
- **ReDoc**: [https://event-management-system-blush-five.vercel.app/redoc](https://event-management-system-blush-five.vercel.app/redoc)

For local development:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
