import { describe, it, expect } from "vitest";
import { isWeekend, isTollFreeDate } from "../src/holidays.js";

const dateFromIso = (date: string): Date => new Date(`${date}T12:00:00`);

const sampledPublicHolidays = [
  { date: "2012-01-06", name: "Epiphany" },
  { date: "2013-04-01", name: "Easter Monday" },
  { date: "2014-05-01", name: "May Day" },
  { date: "2015-12-25", name: "Christmas Day" },
  { date: "2016-01-06", name: "Epiphany" },
  { date: "2017-04-14", name: "Good Friday" },
  { date: "2018-05-01", name: "May Day" },
  { date: "2019-06-06", name: "National Day" },
  { date: "2020-01-01", name: "New Year's Day" },
  { date: "2021-05-13", name: "Ascension Day" },
  { date: "2022-01-06", name: "Epiphany" },
  { date: "2023-04-10", name: "Easter Monday" },
  { date: "2024-05-09", name: "Ascension Day" },
  { date: "2025-06-06", name: "National Day" },
  { date: "2026-01-06", name: "Epiphany" },
  { date: "2027-01-06", name: "Epiphany" },
  { date: "2028-05-01", name: "May Day" },
];

const sampledRegularWeekdays = [
  "2012-09-13",
  "2013-04-24",
  "2014-11-07",
  "2015-06-18",
  "2016-01-04",
  "2017-08-14",
  "2018-03-23",
  "2019-10-07",
  "2020-05-18",
  "2021-12-28",
  "2022-08-11",
  "2023-02-22",
  "2024-09-05",
  "2025-04-16",
  "2026-11-27",
  "2027-06-10",
  "2028-01-21",
];

describe("holidays", () => {
  describe("isWeekend", () => {
    it("should return true for Saturday", () => {
      const saturday = dateFromIso("2026-01-03"); // Saturday
      expect(isWeekend(saturday)).toBe(true);
    });

    it("should return true for Sunday", () => {
      const sunday = dateFromIso("2026-01-04"); // Sunday
      expect(isWeekend(sunday)).toBe(true);
    });

    it("should return false for weekday (Monday)", () => {
      const monday = dateFromIso("2026-01-05"); // Monday
      expect(isWeekend(monday)).toBe(false);
    });

    it("should return false for weekday (Friday)", () => {
      const friday = dateFromIso("2026-01-09"); // Friday
      expect(isWeekend(friday)).toBe(false);
    });
  });

  describe("isTollFreeDate", () => {
    it("should return true for Saturday", () => {
      const saturday = dateFromIso("2026-01-03");
      expect(isTollFreeDate(saturday)).toBe(true);
    });

    it("should return true for Sunday", () => {
      const sunday = dateFromIso("2026-01-04");
      expect(isTollFreeDate(sunday)).toBe(true);
    });

    it("should return true for a regular weekday in July", () => {
      const july = dateFromIso("2026-07-15");
      expect(isTollFreeDate(july)).toBe(true);
    });

    it("should return true for the day before a Swedish public holiday", () => {
      const dayBeforeAscensionDay = dateFromIso("2026-05-13");
      expect(isTollFreeDate(dayBeforeAscensionDay)).toBe(true);
    });

    it("should return false for Swedish observances that are not public holidays", () => {
      const nobelDay = dateFromIso("2026-12-10");
      expect(isTollFreeDate(nobelDay)).toBe(false);
    });

    it.each(sampledPublicHolidays)(
      "should return true for $name on $date",
      ({ date }) => {
        expect(isTollFreeDate(dateFromIso(date))).toBe(true);
      }
    );

    it.each(sampledRegularWeekdays)(
      "should return false for regular weekday %s",
      (date) => {
        expect(isTollFreeDate(dateFromIso(date))).toBe(false);
      }
    );
  });
});
