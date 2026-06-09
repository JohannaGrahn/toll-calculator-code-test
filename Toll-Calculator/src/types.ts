export interface Vehicle {
  type: VehicleType;
}

export type VehicleType =
  | "Motorbike"
  | "Tractor"
  | "Emergency"
  | "Diplomat"
  | "Foreign"
  | "Military"
  | "Car";
