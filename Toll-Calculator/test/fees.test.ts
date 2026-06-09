import { describe, it, expect } from "vitest";
import {
  getTimeBasedFee,
  getTollFeeForPass,
  MAX_DAILY_FEE,
} from "../src/fees.js";
import { Car, Motorbike } from "../src/vehicles.js";

describe("fees", () => {
  describe("getTimeBasedFee", () => {
    it("should return 8 for 06:00-06:29", () => {
      const date = new Date("2026-01-14T06:15:00");
      expect(getTimeBasedFee(date)).toBe(8);
    });

    it("should return 13 for 06:30-06:59", () => {
      const date = new Date("2026-01-14T06:45:00");
      expect(getTimeBasedFee(date)).toBe(13);
    });

    it("should return 18 for 07:00-07:59", () => {
      const date = new Date("2026-01-14T07:30:00");
      expect(getTimeBasedFee(date)).toBe(18);
    });

    it("should return 13 for 08:00-08:29", () => {
      const date = new Date("2026-01-14T08:15:00");
      expect(getTimeBasedFee(date)).toBe(13);
    });

    it("should return 8 for 08:30-14:59", () => {
      const date = new Date("2026-01-14T12:00:00");
      expect(getTimeBasedFee(date)).toBe(8);
    });

    it("should return 13 for 15:00-15:29", () => {
      const date = new Date("2026-01-14T15:15:00");
      expect(getTimeBasedFee(date)).toBe(13);
    });

    it("should return 18 for 15:30-16:59", () => {
      const date = new Date("2026-01-14T16:00:00");
      expect(getTimeBasedFee(date)).toBe(18);
    });

    it("should return 13 for 17:00-17:59", () => {
      const date = new Date("2026-01-14T17:30:00");
      expect(getTimeBasedFee(date)).toBe(13);
    });

    it("should return 8 for 18:00-18:29", () => {
      const date = new Date("2026-01-14T18:15:00");
      expect(getTimeBasedFee(date)).toBe(8);
    });

    it("should return 0 for 18:30-05:59", () => {
      const late = new Date("2026-01-14T22:00:00");
      const early = new Date("2026-01-14T04:00:00");
      expect(getTimeBasedFee(late)).toBe(0);
      expect(getTimeBasedFee(early)).toBe(0);
    });
  });

  describe("getTollFeeForPass", () => {
    it("should return 0 for toll-free vehicle", () => {
      const motorbike = new Motorbike();
      const date = new Date("2026-01-14T07:00:00");
      expect(getTollFeeForPass(date, motorbike)).toBe(0);
    });

    it("should return 0 for toll-free date", () => {
      const car = new Car();
      const sunday = new Date("2026-01-11T07:00:00");
      expect(getTollFeeForPass(sunday, car)).toBe(0);
    });

    it("should return time-based fee for regular pass", () => {
      const car = new Car();
      const date = new Date("2026-01-14T07:00:00");
      expect(getTollFeeForPass(date, car)).toBe(18);
    });
  });

  describe("MAX_DAILY_FEE", () => {
    it("should be 60", () => {
      expect(MAX_DAILY_FEE).toBe(60);
    });
  });
});
