import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { getTollFee } from "./calculator.js";
import { TollCalculatorError } from "./errors.js";
import type { Vehicle, VehicleType } from "./types.js";
import { Car, Motorbike } from "./vehicles.js";

const vehicleTypes = [
  "Car",
  "Motorbike",
  "Tractor",
  "Emergency",
  "Diplomat",
  "Foreign",
  "Military",
] as const satisfies readonly VehicleType[];

const vehicleTypesByInput = new Map(
  vehicleTypes.map((vehicleType) => [normalizeInput(vehicleType), vehicleType])
);

function normalizeInput(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "");
}

function createVehicle(vehicleType: VehicleType): Vehicle {
  if (vehicleType === "Car") return new Car();
  if (vehicleType === "Motorbike") return new Motorbike();
  return { type: vehicleType };
}

function parseDates(value: string): Date[] {
  return value
    .split(",")
    .map((dateText) => dateText.trim())
    .filter((dateText) => dateText.length > 0)
    .map((dateText) => new Date(dateText));
}

async function askForVehicle(
  question: (prompt: string) => Promise<string>
): Promise<Vehicle> {
  while (true) {
    const answer = await question(
      `Vehicle (${vehicleTypes.join(", ")}): `
    );
    const vehicleType = vehicleTypesByInput.get(normalizeInput(answer));

    if (vehicleType) {
      return createVehicle(vehicleType);
    }

    output.write("Please enter one of the listed vehicle types.\n");
  }
}

async function askForDates(
  question: (prompt: string) => Promise<string>
): Promise<Date[]> {
  while (true) {
    const answer = await question(
      "Pass dates, comma-separated (example: 2026-01-14T06:15:00, 2026-01-14T07:15:00): "
    );
    const dates = parseDates(answer);

    if (dates.length > 0) {
      return dates;
    }

    output.write("Please enter at least one pass date.\n");
  }
}

async function calculateToll(
  question: (prompt: string) => Promise<string>
): Promise<void> {
  const vehicle = await askForVehicle(question);

  while (true) {
    const dates = await askForDates(question);

    try {
      const fee = getTollFee(vehicle, ...dates);
      output.write(`Total toll fee for ${vehicle.type}: ${fee} SEK\n`);
      return;
    } catch (error) {
      if (error instanceof TollCalculatorError) {
        output.write(`${error.message}. Please try the pass dates again.\n`);
        continue;
      }

      throw error;
    }
  }
}

async function main(): Promise<void> {
  const readline = createInterface({ input, output });
  const question = readline.question.bind(readline);

  output.write("Toll calculator\n");

  try {
    while (true) {
      await calculateToll(question);

      const again = normalizeInput(
        await question("Calculate another toll? (yes/no): ")
      );
      if (again !== "yes" && again !== "y") {
        break;
      }

      output.write("\n");
    }
  } finally {
    readline.close();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
