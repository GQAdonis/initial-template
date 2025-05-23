import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string or timestamp into a human-readable format
 * @param date Date string, timestamp, or Date object
 * @returns Formatted date string (e.g., "May 23, 2025" or "Today" if today)
 */
export function formatDate(date: string | number | Date): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  const today = new Date();
  
  // Check if the date is today
  if (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  ) {
    return 'Today';
  }
  
  // Format the date
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(dateObj);
}
