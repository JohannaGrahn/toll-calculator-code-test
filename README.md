![here we are](https://media.giphy.com/media/FnGJfc18tDDHy/giphy.gif)

# Toll fee calculator 1.0
A calculator for vehicle toll fees.

* Make sure you read these instructions carefully
* The current code base is in Java and C#, but please make sure that you do an implementation in a language **you feel comfortable** in like Javascript, Python, Assembler or [ModiScript](https://en.wikipedia.org/wiki/ModiScript) (please don't choose ModiScript). 
* No requirement but bonus points if you know what movie is in the gif

## Background
Our city has decided to implement toll fees in order to reduce traffic congestion during rush hours.
This is the current draft of requirements:
 
* Fees will differ between 8 SEK and 18 SEK, depending on the time of day 
* Rush-hour traffic will render the highest fee
* The maximum fee for one day is 60 SEK
* A vehicle should only be charged once an hour
  * In the case of multiple fees in the same hour period, the highest one applies.
* Some vehicle types are fee-free
* Weekends and holidays are fee-free

## Your assignment
The last city-developer quit recently, claiming that this solution is production-ready. 
You are now the new developer for our city - congratulations! 

Your job is to deliver the code and from now on, you are the responsible go-to-person for this solution. This is a solution you will have to put your name on. 

## Instructions
You can make any modifications or suggestions for modifications that you see fit. Fork this repository and deliver your results via a pull-request. You could also create a gist, for privacy reasons, and send us the link.

## Help I dont know C# or Java
No worries! We accept submissions in other languages as well, why not try it in Go or nodejs.

## TypeScript solution notes

### Setup

The new implementation lives in `Toll-Calculator/` and is written in TypeScript.

```bash
cd Toll-Calculator
npm install
```

The solution uses `date-holidays` package for Swedish public holiday lookup instead of maintaining a hard-coded holiday table. The package is algorithm based and maintained so it should hold for holidays every year, which is also the assumption the solution builds upon.

### Running the console calculator

Start the interactive console calculator:

```bash
npm run dev
```

You will be prompted for:

* A vehicle type: `Car`, `Motorbike`, `Tractor`, `Emergency`, `Diplomat`, `Foreign`, `Military`
* One or several pass dates, separated by commas

Example input:

```text
Vehicle (Car, Motorbike, Tractor, Emergency, Diplomat, Foreign, Military): Car
Pass dates, comma-separated (example: 2026-01-14T06:15:00, 2026-01-14T07:15:00): 2026-01-14T06:15:00, 2026-01-14T07:15:00
Total toll fee for Car: 18 SEK
Calculate another toll? (yes/no): no
```

Dates must be valid date strings that JavaScript can parse. All dates in one calculation must be from the same calendar day, because the daily cap applies per day.
Vehicles must be of the VehicleType, but is not case sensitive.

Build the TypeScript project:

```bash
npm run build
```

Run the compiled JavaScript after building:

```bash
npm start
```

### Running the tests

Run the full test suite once:

```bash
npm run test:run
```

Run tests in watch mode:

```bash
npm test
```

### Bugs found in the original Java code

While reviewing `Java/TollCalculator.java`, these bugs and risks were identified:

* Empty or null dates were not checked properly and could cause crashes
* Dates were assumed to be sorted.
* The 60 minute rule was calculated from the first pass only, and the interval start is not updated for later windows.
* Several passes inside one 60-minute window can be overcharged because the code subtracts the first pass fee instead of the fee already counted for that interval.
* Dates from multiple days can be passed together and capped as one day, which can undercharge.
* The `09:00-14:29` interval falls through to `0` because the Java condition only covers `xx:30-xx:59` for hours 8-14.
* Vehicle type matching can throw if `getType()` returns null.
* Holiday handling is hard-coded to 2013.
* Potential bug could also be the handling of time zones, but this solution assumes the system will only be used in the city mentioned in the background part of the README.

### My solution

The TypeScript implementation was built with a TDD approach: tests were added around the expected toll rules, then the implementation was changed until the behavior matched the requirements.

The solution now covers:

* The fee table as a config array in `src/fees.ts`.
* The daily maximum fee of 60 SEK.
* The single-charge rule: within a 60-minute window, only the highest fee is charged.
* Sorting pass dates before calculation.
* Rejecting invalid dates and malformed runtime input.
* Rejecting dates from different calendar days.
* Typed validation errors with stable error codes for easier API handling.
* Toll-free vehicle types.
* Toll-free weekends.
* Swedish public holidays and days before Swedish public holidays via `date-holidays`.
* Keeping the July exception, making July toll-free as well.
* An interactive console entry point in `src/index.ts` for calculating tolls from user-provided vehicle and pass dates.

The tests are split accordingly:

* `test/fees.test.ts` checks the fee schedule and single-pass exemptions.
* `test/calculator.test.ts` checks daily totals, the 60-minute rule, the daily cap, sorting and validation of invalid or non-date input.
* `test/holidays.test.ts` checks weekends, July, Swedish holidays and regular weekdays across several years.
* `test/vehicles.test.ts` checks toll-free and regular vehicle handling.

### Potential improvements

* Move the fee schedule out of the source code and load it from configuration. The current TypeScript solution already represents the time intervals as a table in `src/fees.ts`, but it is still hard-coded into the application. A future version could load the intervals, amounts and daily maximum from JSON, a database or another configuration source so rule changes do not require a code change.
* Add more tests around `date-holidays` so package updates do not unexpectedly change toll-free dates.