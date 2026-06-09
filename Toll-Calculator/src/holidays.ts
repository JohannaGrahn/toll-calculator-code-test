import Holidays from "date-holidays";

// JavaScript returns Sunday as 0 and Saturday as 6.
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

// Limit date-holidays to Swedish public holidays. The package also knows about
// observance holidays such as Nobel Day, but those should not automatically be toll-free.
const swedishPublicHolidays = new Holidays("SE", { types: ["public"] });

// Toll is not charged during July.
function isJuly(date: Date): boolean {
  return date.getMonth() === 6;
}

// Use calendar-day arithmetic rather than adding milliseconds so DST changes do
// not accidentally shift the local day.
function addDays(date: Date, days: number): Date {
  const nextDate = new Date(date);
  nextDate.setDate(date.getDate() + days);
  return nextDate;
}

function isSwedishPublicHoliday(date: Date): boolean {
  return swedishPublicHolidays.isHoliday(date) !== false;
}

function isDayBeforeSwedishPublicHoliday(date: Date): boolean {
  return isSwedishPublicHoliday(addDays(date, 1));
}

export function isTollFreeDate(date: Date): boolean {
  return (
    isWeekend(date) ||
    isJuly(date) ||
    isSwedishPublicHoliday(date) ||
    isDayBeforeSwedishPublicHoliday(date)
  );
}
