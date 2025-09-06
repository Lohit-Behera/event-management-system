import type { TimezoneInfo } from "./api";

// Supported timezones as defined in the backend API (using abbreviations)
export const SUPPORTED_TIMEZONES: TimezoneInfo[] = [
  {
    timezone: "Asia/Kolkata",
    display_name: "IST (Asia/Kolkata)",
    utc_offset: "+05:30",
  },
  { timezone: "UTC", display_name: "UTC (UTC)", utc_offset: "+00:00" },
  {
    timezone: "America/New_York",
    display_name: "EST (America/New_York)",
    utc_offset: "-05:00",
  },
  {
    timezone: "America/Los_Angeles",
    display_name: "PST (America/Los_Angeles)",
    utc_offset: "-08:00",
  },
  {
    timezone: "Europe/London",
    display_name: "GMT (Europe/London)",
    utc_offset: "+00:00",
  },
  {
    timezone: "Europe/Paris",
    display_name: "CET (Europe/Paris)",
    utc_offset: "+01:00",
  },
  {
    timezone: "Asia/Tokyo",
    display_name: "JST (Asia/Tokyo)",
    utc_offset: "+09:00",
  },
  {
    timezone: "Australia/Sydney",
    display_name: "AEST (Australia/Sydney)",
    utc_offset: "+10:00",
  },
];

// Timezone abbreviations as used by the backend
export const TIMEZONE_ABBREVIATIONS = {
  "Asia/Kolkata": "IST",
  UTC: "UTC",
  "America/New_York": "EST",
  "America/Los_Angeles": "PST",
  "Europe/London": "GMT",
  "Europe/Paris": "CET",
  "Asia/Tokyo": "JST",
  "Australia/Sydney": "AEST",
} as const;

// Default timezone
export const DEFAULT_TIMEZONE = "IST";

/**
 * Format a date string to display in a specific timezone
 */
export function formatDateTimeInTimezone(
  dateString: string,
  timezone: string = DEFAULT_TIMEZONE,
  options: Intl.DateTimeFormatOptions = {}
): string {
  const date = new Date(dateString);

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: timezone,
    ...options,
  };

  return date.toLocaleString("en-US", defaultOptions);
}

/**
 * Format a date string to display time only in a specific timezone
 */
export function formatTimeInTimezone(
  dateString: string,
  timezone: string = DEFAULT_TIMEZONE
): string {
  return formatDateTimeInTimezone(dateString, timezone, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Format a date string to display date only in a specific timezone
 */
export function formatDateInTimezone(
  dateString: string,
  timezone: string = DEFAULT_TIMEZONE
): string {
  return formatDateTimeInTimezone(dateString, timezone, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Get timezone display name from timezone identifier
 */
export function getTimezoneDisplayName(timezone: string): string {
  const tz = SUPPORTED_TIMEZONES.find((t) => t.timezone === timezone);
  return tz?.display_name || timezone;
}

/**
 * Get timezone offset from timezone identifier
 */
export function getTimezoneOffset(timezone: string): string {
  const tz = SUPPORTED_TIMEZONES.find((t) => t.timezone === timezone);
  return tz?.utc_offset || "+00:00";
}

/**
 * Check if a timezone is supported
 */
export function isTimezoneSupported(timezone: string): boolean {
  return SUPPORTED_TIMEZONES.some((t) => t.timezone === timezone);
}

/**
 * Get user's local timezone if supported, otherwise return default
 */
export function getUserTimezone(): string {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return isTimezoneSupported(userTimezone) ? userTimezone : DEFAULT_TIMEZONE;
}

/**
 * Format duration between two dates
 */
export function formatDuration(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffMs = end.getTime() - start.getTime();

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffHours > 0) {
    return `${diffHours}h ${diffMinutes > 0 ? `${diffMinutes}m` : ""}`.trim();
  }
  return `${diffMinutes}m`;
}

/**
 * Get timezone abbreviation (e.g., "IST", "EST", "PST")
 */
export function getTimezoneAbbreviation(timezone: string): string {
  const tz = SUPPORTED_TIMEZONES.find((t) => t.timezone === timezone);
  if (tz) {
    const match = tz.display_name.match(/^([A-Z]+)/);
    return match ? match[1] : timezone;
  }
  return timezone;
}

/**
 * Get timezone abbreviation from timezone name
 */
export function getAbbreviationFromTimezone(timezone: string): string {
  return (
    TIMEZONE_ABBREVIATIONS[timezone as keyof typeof TIMEZONE_ABBREVIATIONS] ||
    timezone
  );
}

/**
 * Get timezone name from abbreviation
 */
export function getTimezoneFromAbbreviation(abbreviation: string): string {
  const entry = Object.entries(TIMEZONE_ABBREVIATIONS).find(
    ([_, abbr]) => abbr === abbreviation
  );
  return entry ? entry[0] : abbreviation;
}

/**
 * Get timezone info by abbreviation
 */
export function getTimezoneInfoByAbbreviation(
  abbreviation: string
): TimezoneInfo | undefined {
  const timezone = getTimezoneFromAbbreviation(abbreviation);
  return SUPPORTED_TIMEZONES.find((t) => t.timezone === timezone);
}
