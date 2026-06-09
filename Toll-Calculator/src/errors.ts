export type TollCalculatorErrorCode =
  | "INVALID_PASS_DATE"
  | "PASS_DATES_SPAN_MULTIPLE_DAYS";

export class TollCalculatorError extends Error {
  public readonly code: TollCalculatorErrorCode;

  protected constructor(code: TollCalculatorErrorCode, message: string) {
    super(message);
    this.name = new.target.name;
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class InvalidPassDateError extends TollCalculatorError {
  constructor() {
    super("INVALID_PASS_DATE", "Invalid pass date");
  }
}

export class PassDatesSpanMultipleDaysError extends TollCalculatorError {
  constructor() {
    super(
      "PASS_DATES_SPAN_MULTIPLE_DAYS",
      "All pass dates must be from the same day"
    );
  }
}
