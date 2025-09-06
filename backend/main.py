from fastapi import FastAPI, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from database import create_tables, test_connection
from schemas import EventCreate, EventResponse, AttendeeCreate, AttendeeResponse, EventWithAttendees, EventWithTimezone
from crud import create_event, get_events, get_event, create_attendee, get_attendees, get_attendees_count
from timezone_utils import convert_from_utc, format_datetime_with_timezone, get_timezone_info, get_supported_timezones
from datetime import datetime
import os
import logging

app = FastAPI(title="Event Management System", version="1.0.0")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    """Create database tables on startup"""
    try:
        create_tables()
        logger.info("Database tables created successfully")
        
        # Test database connection
        if test_connection():
            logger.info("Database connection test successful")
        else:
            logger.warning("Database connection test failed")
    except Exception as e:
        logger.error(f"Failed to create database tables: {e}")
        # Don't raise the exception to allow the app to start even if DB is unavailable

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/events", response_model=EventResponse)
async def create_new_event(event: EventCreate):
    """Create a new event"""
    if event.start_time >= event.end_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="End time must be after start time"
        )
    
    if event.max_capacity <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Max capacity must be greater than 0"
        )
    
    try:
        return await create_event(event=event)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@app.get("/events", response_model=list[EventResponse])
async def list_events(skip: int = 0, limit: int = 100):
    """List all upcoming events"""
    return await get_events(skip=skip, limit=limit)

@app.post("/events/{event_id}/register", response_model=AttendeeResponse)
async def register_attendee(event_id: int, attendee: AttendeeCreate):
    """Register an attendee for a specific event"""
    attendee_result, error = await create_attendee(attendee=attendee, event_id=event_id)
    
    if error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error
        )
    
    return attendee_result

@app.get("/events/{event_id}/attendees", response_model=list[AttendeeResponse])
async def get_event_attendees(
    event_id: int, 
    skip: int = Query(0, ge=0, description="Number of attendees to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of attendees to return")
):
    """Get attendees for a specific event with pagination"""
    # Check if event exists
    event = await get_event(event_id)
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    
    return await get_attendees(event_id=event_id, skip=skip, limit=limit)

@app.get("/events/{event_id}", response_model=EventWithAttendees)
async def get_event_with_attendees(event_id: int):
    """Get event details with all attendees"""
    event = await get_event(event_id)
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    
    attendees = await get_attendees(event_id=event_id)
    return EventWithAttendees(
        id=event.id,
        name=event.name,
        location=event.location,
        start_time=event.start_time,
        end_time=event.end_time,
        max_capacity=event.max_capacity,
        attendees=attendees
    )

@app.get("/timezones")
def get_supported_timezones_list():
    """Get list of supported timezones"""
    return get_supported_timezones()

@app.get("/events/{event_id}/attendees/count")
async def get_event_attendees_count(event_id: int):
    """Get total count of attendees for a specific event"""
    # Check if event exists
    event = await get_event(event_id)
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    
    count = await get_attendees_count(event_id=event_id)
    return {"event_id": event_id, "total_attendees": count}

@app.get("/events/{event_id}/timezone", response_model=EventWithTimezone)
async def get_event_with_timezone(
    event_id: int, 
    timezone: str = Query("IST", description="Timezone to convert times to")
):
    """Get event details with times converted to specified timezone"""
    event = await get_event(event_id)
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    
    # Get timezone info
    tz_info = get_timezone_info(timezone)
    if not tz_info:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported timezone: {timezone}"
        )
    
    # Convert times to the specified timezone
    start_time_local = format_datetime_with_timezone(event.start_time, timezone)
    end_time_local = format_datetime_with_timezone(event.end_time, timezone)
    
    return EventWithTimezone(
        id=event.id,
        name=event.name,
        location=event.location,
        start_time=event.start_time,
        end_time=event.end_time,
        max_capacity=event.max_capacity,
        attendee_count=event.attendee_count,
        timezone=event.timezone,
        start_time_local=start_time_local,
        end_time_local=end_time_local,
        timezone_display=tz_info.display_name
    )

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Event Management System API"}

@app.get("/health")
async def health_check():
    """Health check endpoint that doesn't require database access"""
    return {"status": "healthy", "message": "API is running"}

@app.get("/health/full")
async def full_health_check():
    """Comprehensive health check including API and database status"""
    health_status = {
        "api": {
            "status": "healthy",
            "message": "API is running",
            "timestamp": datetime.now().isoformat()
        },
        "database": {
            "status": "unknown",
            "connected": False
        }
    }
    
    # Test database connection
    try:
        if test_connection():
            from database import db
            with db.get_cursor() as cursor:
                cursor.execute("SELECT version(), current_database(), current_user, NOW()")
                result = cursor.fetchone()
                
                health_status["database"] = {
                    "status": "healthy",
                    "connected": True,
                    "name": result['current_database'],
                    "version": result['version'].split(',')[0],
                    "user": result['current_user'],
                    "server_time": result['now'].isoformat(),
                    "timestamp": datetime.now().isoformat()
                }
        else:
            health_status["database"] = {
                "status": "unhealthy",
                "connected": False,
                "error": "Connection test failed",
                "timestamp": datetime.now().isoformat()
            }
    except Exception as e:
        health_status["database"] = {
            "status": "unhealthy",
            "connected": False,
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }
    
    # Determine overall status
    overall_status = "healthy" if health_status["database"]["status"] == "healthy" else "degraded"
    
    return {
        "overall_status": overall_status,
        "timestamp": datetime.now().isoformat(),
        **health_status
    }

@app.get("/health/db")
async def health_check_db():
    """Health check endpoint that tests database connection with detailed information"""
    try:
        # Test database connection
        if test_connection():
            # Get additional database information
            from database import db
            with db.get_cursor() as cursor:
                # Get database version
                cursor.execute("SELECT version()")
                db_version = cursor.fetchone()['version']
                
                # Get current timestamp
                cursor.execute("SELECT NOW() as current_time")
                current_time = cursor.fetchone()['current_time']
                
                # Get database name
                cursor.execute("SELECT current_database() as db_name")
                db_name = cursor.fetchone()['db_name']
                
                # Get connection info
                cursor.execute("SELECT current_user as user_name, inet_server_addr() as server_ip, inet_server_port() as server_port")
                conn_info = cursor.fetchone()
                
                return {
                    "status": "healthy", 
                    "message": "Database connection is working",
                    "database": {
                        "connected": True,
                        "name": db_name,
                        "version": db_version.split(',')[0],  # Get just the PostgreSQL version
                        "current_time": current_time.isoformat(),
                        "connection_info": {
                            "user": conn_info['user_name'],
                            "server_ip": conn_info['server_ip'],
                            "server_port": conn_info['server_port']
                        }
                    },
                    "timestamp": datetime.now().isoformat()
                }
        else:
            raise Exception("Database connection test failed")
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "status": "unhealthy",
                "message": "Database connection failed",
                "database": {
                    "connected": False,
                    "error": str(e)
                },
                "timestamp": datetime.now().isoformat()
            }
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)