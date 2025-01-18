import {
  endOfMonth, format, startOfMonth, addMonths, isAfter, isBefore, isEqual,
} from 'date-fns';
import { compareAsc } from 'date-fns/fp';

/** Converts date string to date picker format */
export const convertToFieldDate = (date: string | null | undefined) => {
  if (date) {
    return new Date(date).toISOString().substr(0, 10);
  }
  return '';
};

/** Converts date string to month date picker format */
export const convertToMonthFieldDate = (date: string | null | undefined) => {
  if (date) {
    return new Date(date).toISOString().substr(0, 7);
  }
  return '';
};

// Force local date to 2nd of month so that date-fns works properly
// otherwise certain time zones may be read as the previous month.
/** Converts a local month picker date string into end-of-month date string */
export const endOfMonthDateString = (monthString: string) => format(
  endOfMonth(new Date(`${monthString}-02`)),
  'yyyy-MM-dd',
);

/** Converts a local month picker date string into start-of-month date string */
export const startOfMonthDateString = (monthString: string) => format(
  startOfMonth(new Date(`${monthString}-02`)),
  'yyyy-MM-dd',
);

/** converts a date to a date string, like "June 1, 2020" */
export const toLocalizedDate = (date: string | null | undefined) => {
  const dateOpts = {
    timeZone: 'UTC',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  } as const;
  if (date) {
    return new Date(date).toLocaleDateString('en-US', dateOpts);
  }
  return 'No date specified';
};

export const compareDates = (left: string | undefined, right: string | undefined) => {
  const leftTime = new Date(left || 0).getTime();
  const rightTime = new Date(right || 0).getTime();
  return leftTime - rightTime;
};

export const startOfUTCDay = (date: string | number | Date) => {
  const copy = new Date(date);
  copy.setUTCHours(0, 0, 0, 0);
  return copy;
};

export const isAfterDate = (date: Date, dateToCompare: Date) => (
  isAfter(startOfUTCDay(date), startOfUTCDay(dateToCompare)));
export const isBeforeDate = (date: Date, dateToCompare: Date) => (
  isBefore(startOfUTCDay(date), startOfUTCDay(dateToCompare)));
export const isEqualDate = (date: Date, dateToCompare: Date) => (
  isEqual(startOfUTCDay(date), startOfUTCDay(dateToCompare)));
export const compareAscDate = (date: Date, dateToCompare: Date) => (
  compareAsc(startOfUTCDay(date), startOfUTCDay(dateToCompare)));
export const isUTCFirstDayOfMonth = (date: Date) => (date.getUTCDate() === 1);
export const toEndOfUtcDay = (date: Date) => (
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999))
);

/**
     * Gets a date which is start of the next month or the date itself if date is a start of the month
     * @param date Date gets a date and returns start of the closes month after or equal to it
     * @returns Date which is the closest start of the month after or equal to it
     */
export const startOfNextMonth = (date: Date) => {
  let nextBestDate = startOfMonth(date);
  // Guarantees the date selected is a start of the month
  if (!isEqualDate(nextBestDate, date)) {
    nextBestDate = addMonths(nextBestDate, 1);
  }
  return nextBestDate;
};
