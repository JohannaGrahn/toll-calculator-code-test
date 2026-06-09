import type { Vehicle } from "./types.js";
import {
  InvalidPassDateError,
  PassDatesSpanMultipleDaysError,
} from "./errors.js";
import { getTollFeeForPass, MAX_DAILY_FEE } from "./fees.js";

function isValidDate(date: unknown): date is Date {
  return date instanceof Date && !Number.isNaN(date.getTime());
}

// The daily cap is only valid for one calendar day.
function isSameCalendarDay(firstDate: Date, nextDate: Date): boolean {
  return (
    firstDate.getFullYear() === nextDate.getFullYear() &&
    firstDate.getMonth() === nextDate.getMonth() &&
    firstDate.getDate() === nextDate.getDate()
  );
}

function validatePassDates(dates: readonly Date[]): void {
  if (dates.some((date) => !isValidDate(date))) {
    throw new InvalidPassDateError();
  }

  const firstDate = dates[0];
  if (
    firstDate !== undefined &&
    dates.some((date) => !isSameCalendarDay(firstDate, date))
  ) {
    throw new PassDatesSpanMultipleDaysError();
  }
}

// Calculates the total toll fee for one vehicle during one day.
export function getTollFee(vehicle: Vehicle, ...dates: Date[]): number {
  if (dates.length === 0) return 0;

  validatePassDates(dates);

  const sortedDates = [...dates].sort((a, b) => a.getTime() - b.getTime());
  let intervalStart = sortedDates[0];
  let intervalMaxFee = getTollFeeForPass(intervalStart, vehicle);
  let totalFee = 0;

  for (const date of sortedDates.slice(1)) {
    const fee = getTollFeeForPass(date, vehicle);
    const minutes = Math.floor(
      (date.getTime() - intervalStart.getTime()) / 60000
    );

    // The Gothenburg single-charge rule charges only the highest fee in a
    // 60-minute window. We keep the current window's max fee separate until a
    // later pass starts a new window.
    if (minutes <= 60) {
      intervalMaxFee = Math.max(intervalMaxFee, fee);
    } else {
      totalFee += intervalMaxFee;
      intervalStart = date;
      intervalMaxFee = fee;
    }

    if (totalFee >= MAX_DAILY_FEE) {
      return MAX_DAILY_FEE;
    }
  }

  totalFee += intervalMaxFee;
  return Math.min(totalFee, MAX_DAILY_FEE);
}
