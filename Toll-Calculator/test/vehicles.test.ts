import { describe, it, expect } from "vitest";
import { Car, Motorbike, isTollFreeVehicle } from "../src/vehicles.js";
import { VehicleType } from "../src/types.js";

describe("vehicles", () => {
  describe("Car", () => {
    it("should have type 'Car'", () => {
      const car = new Car();
      expect(car.type).toBe("Car");
    });

    it("should not be toll-free", () => {
      const car = new Car();
      expect(isTollFreeVehicle(car)).toBe(false);
    });
  });

  describe("Motorbike", () => {
    it("should have type 'Motorbike'", () => {
      const motorbike = new Motorbike();
      expect(motorbike.type).toBe("Motorbike");
    });

    it("should be toll-free", () => {
      const motorbike = new Motorbike();
      expect(isTollFreeVehicle(motorbike)).toBe(true);
    });
  });

  describe("isTollFreeVehicle", () => {
    it("should return false for null vehicle", () => {
      expect(isTollFreeVehicle(null)).toBe(false);
    });

    it("should return false for undefined vehicle", () => {
      expect(isTollFreeVehicle(undefined)).toBe(false);
    });

    it("should return false when vehicle.type is null", () => {
      const vehicle: any = { type: null };
      expect(isTollFreeVehicle(vehicle)).toBe(false);
    });

    it("should return false for toll-free types with wrong casing", () => {
      const vehicle: any = { type: "motorbike" };
      expect(isTollFreeVehicle(vehicle)).toBe(false);
    });

    it("should return false for misspelled toll-free types", () => {
      const vehicle: any = { type: "Motobike" };
      expect(isTollFreeVehicle(vehicle)).toBe(false);
    });

    it("should return true for toll-free vehicle types", () => {
      const tollFreeTypes : VehicleType[] = [
        "Motorbike",
        "Tractor",
        "Emergency",
        "Diplomat",
        "Foreign",
        "Military",
      ];
      tollFreeTypes.forEach((type) => {
        const vehicle = { type };
        expect(isTollFreeVehicle(vehicle)).toBe(true);
      });
    });

    it("should return false for regular vehicles", () => {
        expect(isTollFreeVehicle({ type: "Car" })).toBe(false);
      });
    });
  });
