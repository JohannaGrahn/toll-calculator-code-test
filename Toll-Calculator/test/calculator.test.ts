import { describe, it, expect } from "vitest";
import { getTollFee } from "../src/calculator.js";
import {
  InvalidPassDateError,
  PassDatesSpanMultipleDaysError,
} from "../src/errors.js";
import { Car, Motorbike } from "../src/vehicles.js";

describe("calculator", () => {
  describe("getTollFee", () => {
    it("should return 0 for empty dates", () => {
      const car = new Car();
      expect(getTollFee(car)).toBe(0);
    });

    it("should return 0 for toll-free vehicle", () => {
      const motorbike = new Motorbike();
      const dates = [
        new Date("2026-01-14T06:00:00"),
        new Date("2026-01-14T07:00:00"),
      ];
      expect(getTollFee(motorbike, ...dates)).toBe(0);
    });

    it("should return 0 for weekend dates", () => {
      const car = new Car();
      const saturday = new Date("2026-01-10T07:00:00");
      const sunday = new Date("2026-01-11T07:00:00");
      expect(getTollFee(car, saturday)).toBe(0);
      expect(getTollFee(car, sunday)).toBe(0);
    });

    it("should calculate fee for single pass", () => {
      const car = new Car();
      const date = new Date("2026-01-14T07:00:00");
      expect(getTollFee(car, date)).toBe(18);
    });

    it("should handle unsorted dates", () => {
      const car = new Car();
      const dates = [
        new Date("2026-01-14T09:00:00"),
        new Date("2026-01-14T06:00:00"),
        new Date("2026-01-14T07:00:00"),
      ];
      const fee = getTollFee(car, ...dates);
      expect(fee).toBe(26);
    });

    it("should reject invalid dates", () => {
      const car = new Car();
      const calculateFee = () => getTollFee(car, new Date("not-a-date"));

      try {
        calculateFee();
        expect.fail("Expected invalid date to throw");
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidPassDateError);
        expect(error).toMatchObject({
          code: "INVALID_PASS_DATE",
          message: "Invalid pass date",
        });
      }
    });

    it("should reject non-date runtime input", () => {
      const car = new Car();
      const calculateFee = () => getTollFee(car, null as unknown as Date);

      try {
        calculateFee();
        expect.fail("Expected non-date input to throw");
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidPassDateError);
        expect(error).toMatchObject({
          code: "INVALID_PASS_DATE",
          message: "Invalid pass date",
        });
      }
    });

    it("should reject dates from different days", () => {
      const car = new Car();
      const calculateFee = () =>
        getTollFee(
          car,
          new Date("2026-01-14T07:00:00"),
          new Date("2026-01-15T07:00:00")
        );

      try {
        calculateFee();
        expect.fail("Expected multi-day dates to throw");
      } catch (error) {
        expect(error).toBeInstanceOf(PassDatesSpanMultipleDaysError);
        expect(error).toMatchObject({
          code: "PASS_DATES_SPAN_MULTIPLE_DAYS",
          message: "All pass dates must be from the same day",
        });
      }
    });

    it("should calculate a complex weekday schedule across multiple intervals", () => {
      const car = new Car();
      const dates = [
        new Date("2026-01-14T06:10:00"), // 8
        new Date("2026-01-14T06:50:00"), // 13 within the same window
        new Date("2026-01-14T08:20:00"), // 13 new window
        new Date("2026-01-14T09:00:00"), // 8 within the same window
        new Date("2026-01-14T15:10:00"), // 13 new window
        new Date("2026-01-14T16:05:00"), // 18 within the same window
        new Date("2026-01-14T17:20:00"), // 13 new window
      ];
      const fee = getTollFee(car, ...dates);
      expect(fee).toBe(57);
    });

    it("should cap a busy weekday at the daily maximum", () => {
      const car = new Car();
      const dates = [
        new Date("2026-01-14T06:10:00"), // 8
        new Date("2026-01-14T06:50:00"), // 13 same window
        new Date("2026-01-14T07:40:00"), // 18 new window
        new Date("2026-01-14T08:30:00"), // 8 within the same window
        new Date("2026-01-14T09:35:00"), // 8 new window
        new Date("2026-01-14T15:15:00"), // 13 new window
        new Date("2026-01-14T15:50:00"), // 18 within the same window
        new Date("2026-01-14T17:20:00"), // 13 new window
      ];
      const fee = getTollFee(car, ...dates);
      expect(fee).toBe(60);
    });

    it("should return 0 for a Swedish public holiday", () => {
      const car = new Car();
      const christmasDay = new Date("2026-12-25T07:00:00");
      expect(getTollFee(car, christmasDay)).toBe(0);
    });

    it("should charge only the highest fee for passes within 60 minutes, including the 60-minute boundary", () => {
      const car = new Car();
      const dates = [
        new Date("2026-01-14T06:15:00"), // Fee: 8
        new Date("2026-01-14T06:45:00"), // Fee: 13
        new Date("2026-01-14T07:15:00"), // Fee: 18, still within 60 min of 06:15
      ];
      const fee = getTollFee(car, ...dates);
      expect(fee).toBe(18);
    });

    it("should sum fees for passes more than 60 minutes apart", () => {
      const car = new Car();
      // Passes more than 60 minutes apart
      const dates = [
        new Date("2026-01-14T06:00:00"), // Fee: 8
        new Date("2026-01-14T08:00:00"), // Fee: 13 (more than 60 min, new window)
      ];
      const fee = getTollFee(car, ...dates);
      expect(fee).toBe(21);
    });
  });
});
