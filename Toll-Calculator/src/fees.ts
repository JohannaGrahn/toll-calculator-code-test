import type { Vehicle } from "./types.js";
import { isTollFreeDate } from "./holidays.js";
import { isTollFreeVehicle } from "./vehicles.js";

// Gothenburg's daily cap for each vehicle.
export const MAX_DAILY_FEE = 60;

// Time ranges are stored as minute-of-day values so the fee can be read
// as data instead of as a long chain of hour/minute conditionals.
type FeeInterval = {
  fromMinute: number;
  throughMinute: number;
  fee: number;
};

const timeOfDay = (hour: number, minute: number): number =>
  hour * 60 + minute;

// Fee intervals from the original requirement, including ranges such as
// 09:00-09:29 that fell through in the original Java code.
const feeIntervals: readonly FeeInterval[] = [
  {
    fromMinute: timeOfDay(6, 0),
    throughMinute: timeOfDay(6, 29),
    fee: 8,
  },
  {
    fromMinute: timeOfDay(6, 30),
    throughMinute: timeOfDay(6, 59),
    fee: 13,
  },
  {
    fromMinute: timeOfDay(7, 0),
    throughMinute: timeOfDay(7, 59),
    fee: 18,
  },
  {
    fromMinute: timeOfDay(8, 0),
    throughMinute: timeOfDay(8, 29),
    fee: 13,
  },
  {
    fromMinute: timeOfDay(8, 30),
    throughMinute: timeOfDay(14, 59),
    fee: 8,
  },
  {
    fromMinute: timeOfDay(15, 0),
    throughMinute: timeOfDay(15, 29),
    fee: 13,
  },
  {
    fromMinute: timeOfDay(15, 30),
    throughMinute: timeOfDay(16, 59),
    fee: 18,
  },
  {
    fromMinute: timeOfDay(17, 0),
    throughMinute: timeOfDay(17, 59),
    fee: 13,
  },
  {
    fromMinute: timeOfDay(18, 0),
    throughMinute: timeOfDay(18, 29),
    fee: 8,
  },
];

// Returns the fee for a single pass before vehicle/date exemptions are applied.
export function getTimeBasedFee(date: Date): number {
  const passMinute = timeOfDay(date.getHours(), date.getMinutes());
  const interval = feeIntervals.find(
    ({ fromMinute, throughMinute }) =>
      passMinute >= fromMinute && passMinute <= throughMinute
  );

  return interval?.fee ?? 0;
}

// Returns the fee for a single pass, or 0 if the pass is toll-free.
export function getTollFeeForPass(date: Date, vehicle: Vehicle): number {
  if (isTollFreeDate(date) || isTollFreeVehicle(vehicle)) {
    return 0;
  }
  return getTimeBasedFee(date);
}
