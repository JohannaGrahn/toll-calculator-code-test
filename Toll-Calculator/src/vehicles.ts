import type { Vehicle, VehicleType } from "./types.js";

export class Car implements Vehicle {
  public readonly type: VehicleType = "Car";
}

export class Motorbike implements Vehicle {
  public readonly type: VehicleType = "Motorbike";
}

const tollFreeVehicleTypes: ReadonlySet<VehicleType> = new Set([
  "Motorbike",
  "Tractor",
  "Emergency",
  "Diplomat",
  "Foreign",
  "Military",
]);

export function isTollFreeVehicle(vehicle?: Vehicle | null): boolean {
  if (!vehicle?.type) return false;
  return tollFreeVehicleTypes.has(vehicle.type);
}
