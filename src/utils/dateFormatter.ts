/**
 * Centralized date formatting utilities that ensure all timestamps
 * display in the user's system timezone and locale format
 */

export interface DateFormatOptions {
  includeTime?: boolean;
  includeSeconds?: boolean;
  relative?: boolean;
  format?: 'short' | 'medium' | 'long' | 'full';
}

/**
 * Format a date string or Date object to display in user's local timezone
 */
export function formatDate(
  date: string | Date | null | undefined,
  options: DateFormatOptions = {}
): string {
  if (!date) return 'N/A';

  const {
    includeTime = false,
    includeSeconds = false,
    relative = false,
    format = 'medium'
  } = options;

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }

    // Return relative time if requested
    if (relative) {
      return formatRelativeTime(dateObj);
    }

    // Configure Intl.DateTimeFormat options
    const formatOptions: Intl.DateTimeFormatOptions = {
      dateStyle: format,
    };

    if (includeTime) {
      formatOptions.timeStyle = includeSeconds ? 'medium' : 'short';
      delete formatOptions.dateStyle; // Can't use both dateStyle and individual options
      
      // Set individual date options when using time
      switch (format) {
        case 'short':
          formatOptions.year = '2-digit';
          formatOptions.month = 'numeric';
          formatOptions.day = 'numeric';
          break;
        case 'medium':
          formatOptions.year = 'numeric';
          formatOptions.month = 'short';
          formatOptions.day = 'numeric';
          break;
        case 'long':
          formatOptions.year = 'numeric';
          formatOptions.month = 'long';
          formatOptions.day = 'numeric';
          break;
        case 'full':
          formatOptions.weekday = 'long';
          formatOptions.year = 'numeric';
          formatOptions.month = 'long';
          formatOptions.day = 'numeric';
          break;
      }
    }

    // Use Intl.DateTimeFormat for proper localization
    return new Intl.DateTimeFormat(undefined, formatOptions).format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
}

/**
 * Format date with time (convenience function)
 */
export function formatDateTime(
  date: string | Date | null | undefined,
  options: Omit<DateFormatOptions, 'includeTime'> = {}
): string {
  return formatDate(date, { ...options, includeTime: true });
}

/**
 * Format date only (convenience function)
 */
export function formatDateOnly(
  date: string | Date | null | undefined,
  options: Omit<DateFormatOptions, 'includeTime'> = {}
): string {
  return formatDate(date, { ...options, includeTime: false });
}

/**
 * Format relative time (e.g., "2 hours ago", "in 3 days")
 */
export function formatRelativeTime(date: string | Date): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

    // Use Intl.RelativeTimeFormat for proper localization
    const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });

    const intervals = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'week', seconds: 604800 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(Math.abs(diffInSeconds) / interval.seconds);
      if (count >= 1) {
        return rtf.format(
          diffInSeconds < 0 ? count : -count,
          interval.label as Intl.RelativeTimeFormatUnit
        );
      }
    }

    return rtf.format(-diffInSeconds, 'second');
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Unknown time';
  }
}

/**
 * Get current timestamp in user's local timezone
 */
export function getCurrentTimestamp(options: DateFormatOptions = {}): string {
  return formatDate(new Date(), options);
}

/**
 * Check if a date string is valid
 */
export function isValidDate(date: string | Date | null | undefined): boolean {
  if (!date) return false;
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return !isNaN(dateObj.getTime());
  } catch {
    return false;
  }
}
