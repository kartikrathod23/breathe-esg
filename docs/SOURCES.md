## SAP-style fuel data

The SAP fuel ingestion format was inspired by common ERP export patterns where:

* column names are abbreviated
* localized field names appear
* units are inconsistent across files

Example fields used:

* `WERK`
* `KRAFTSTOFF`
* `MENGE`
* `EINHEIT`

I intentionally used partially German-style field names because many SAP deployments contain localized exports rather than perfectly standardized English CSVs.

The goal was to simulate ingestion conditions that are slightly messier than toy demo data.

---

## Utility electricity data

The utility ingestion format was modeled after simplified industrial electricity billing exports.

Fields included:

* meter identifiers
* billing periods
* kWh usage
* tariff information

Example:

* monthly industrial electricity consumption
* unusually high meter readings
* large facility usage patterns

I intentionally included high consumption rows to test suspicious detection logic.

---

## Travel data

The travel dataset was modeled after simplified corporate travel reporting exports.

Fields included:

* employee names
* travel type
* origin/destination
* travel distance

Travel types included:

* flights
* cab travel
* hotel stays

I intentionally added unrealistic travel distances to simulate anomaly review cases.

---

## Emission calculations

The CO2e calculations currently use simplified hardcoded multipliers.

The goal was not emissions-science accuracy, but rather:

* ingestion flow
* normalization
* review workflow
* suspicious detection

In a production system, these factors would likely come from:

* region-specific datasets
* emissions factor registries
* versioned environmental databases

---

## Why simplified CSVs were used

I intentionally kept the source files small and understandable because the assignment seemed more focused on:

* ingestion architecture
* reviewability
* modeling decisions
* analyst workflow

rather than building large-scale ETL pipelines.

The schemas are simplified, but designed to resemble realistic enterprise exports rather than artificial demo tables.
