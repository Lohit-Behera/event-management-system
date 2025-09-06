"""
Timezone management utilities for the Event Management System.
Handles timezone conversion and validation for events.
"""
import pytz
from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class TimezoneInfo(BaseModel):
    """Timezone information model."""
    timezone: str
    display_name: str
    utc_offset: str

# Common timezones supported by the system
SUPPORTED_TIMEZONES = {
    'UTC': 'UTC',
    'IST': 'Asia/Kolkata',
    'EST': 'America/New_York',
    'PST': 'America/Los_Angeles',
    'GMT': 'Europe/London',
    'CET': 'Europe/Paris',
    'JST': 'Asia/Tokyo',
    'AEST': 'Australia/Sydney',
}

def get_timezone_info(timezone_abbr: str) -> Optional[TimezoneInfo]:
    """
    Get timezone information for a given timezone abbreviation.
    
    Args:
        timezone_abbr: Timezone abbreviation (e.g., 'IST', 'UTC', 'EST')
    
    Returns:
        TimezoneInfo object or None if timezone not supported
    """
    if timezone_abbr not in SUPPORTED_TIMEZONES:
        return None
    
    tz_name = SUPPORTED_TIMEZONES[timezone_abbr]
    tz = pytz.timezone(tz_name)
    
    # Get current UTC offset
    now = datetime.now(tz)
    utc_offset = now.strftime('%z')
    utc_offset_formatted = f"{utc_offset[:3]}:{utc_offset[3:]}"
    
    return TimezoneInfo(
        timezone=tz_name,
        display_name=f"{timezone_abbr} ({tz_name})",
        utc_offset=utc_offset_formatted
    )

def convert_to_utc(dt: datetime, timezone_abbr: str) -> datetime:
    """
    Convert a datetime to UTC from the specified timezone.
    
    Args:
        dt: Datetime object (can be naive or timezone-aware)
        timezone_abbr: Source timezone abbreviation
    
    Returns:
        Datetime object in UTC
    """
    if timezone_abbr not in SUPPORTED_TIMEZONES:
        raise ValueError(f"Unsupported timezone: {timezone_abbr}")
    
    tz_name = SUPPORTED_TIMEZONES[timezone_abbr]
    tz = pytz.timezone(tz_name)
    
    # If datetime is already timezone-aware, convert it directly
    if dt.tzinfo is not None:
        # Convert from current timezone to UTC
        return dt.astimezone(pytz.UTC)
    else:
        # If datetime is naive, localize it to the specified timezone first
        localized_dt = tz.localize(dt)
        # Convert to UTC
        return localized_dt.astimezone(pytz.UTC)

def convert_from_utc(dt: datetime, timezone_abbr: str) -> datetime:
    """
    Convert a UTC datetime to the specified timezone.
    
    Args:
        dt: UTC datetime object
        timezone_abbr: Target timezone abbreviation
    
    Returns:
        Datetime object in the specified timezone
    """
    if timezone_abbr not in SUPPORTED_TIMEZONES:
        raise ValueError(f"Unsupported timezone: {timezone_abbr}")
    
    tz_name = SUPPORTED_TIMEZONES[timezone_abbr]
    tz = pytz.timezone(tz_name)
    
    # Convert from UTC to the specified timezone
    return dt.astimezone(tz)

def format_datetime_with_timezone(dt: datetime, timezone_abbr: str) -> str:
    """
    Format a datetime with timezone information.
    
    Args:
        dt: Datetime object
        timezone_abbr: Timezone abbreviation
    
    Returns:
        Formatted datetime string with timezone
    """
    if timezone_abbr not in SUPPORTED_TIMEZONES:
        raise ValueError(f"Unsupported timezone: {timezone_abbr}")
    
    tz_name = SUPPORTED_TIMEZONES[timezone_abbr]
    tz = pytz.timezone(tz_name)
    
    # Convert to the specified timezone
    localized_dt = dt.astimezone(tz)
    
    return localized_dt.strftime(f"%Y-%m-%d %H:%M:%S {timezone_abbr}")

def get_current_time_in_timezone(timezone_abbr: str) -> datetime:
    """
    Get current time in the specified timezone.
    
    Args:
        timezone_abbr: Timezone abbreviation
    
    Returns:
        Current datetime in the specified timezone
    """
    if timezone_abbr not in SUPPORTED_TIMEZONES:
        raise ValueError(f"Unsupported timezone: {timezone_abbr}")
    
    tz_name = SUPPORTED_TIMEZONES[timezone_abbr]
    tz = pytz.timezone(tz_name)
    
    return datetime.now(tz)

def validate_timezone(timezone_abbr: str) -> bool:
    """
    Validate if a timezone abbreviation is supported.
    
    Args:
        timezone_abbr: Timezone abbreviation to validate
    
    Returns:
        True if supported, False otherwise
    """
    return timezone_abbr in SUPPORTED_TIMEZONES

def get_supported_timezones() -> list[TimezoneInfo]:
    """
    Get list of all supported timezones.
    
    Returns:
        List of TimezoneInfo objects
    """
    timezones = []
    for abbr in SUPPORTED_TIMEZONES.keys():
        tz_info = get_timezone_info(abbr)
        if tz_info:
            timezones.append(tz_info)
    return timezones
