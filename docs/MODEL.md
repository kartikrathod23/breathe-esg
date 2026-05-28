## Organization

Stores company/tenant information.

Fields:

* `name` -> organization name
* `created_at` -> creation timestamp

Used as the parent entity for ingestion and emissions records.

---

## DataSource

Represents an uploaded CSV source file.

Fields:

* `organization` -> linked organization
* `source_type` -> sap / utility / travel
* `file` -> uploaded CSV file
* `uploaded_at` -> upload timestamp

Purpose:

* track uploaded files
* maintain source lineage
* separate ingestion batches

Example:

* SAP fuel upload
* utility electricity upload
* travel expense upload

---

## RawRecord

Stores raw ingestion rows before normalization.

Fields:

* `source` -> linked DataSource
* `raw_data` -> original row JSON
* `status` -> pending / processed / failed
* `error_message` -> parsing or validation error
* `created_at` -> ingestion timestamp

Purpose:

* preserve original uploaded payload
* allow debugging of failed rows
* avoid losing source-specific structure

Example raw row:

```json id="v0ifgq"
{
  "WERK":"PLT01",
  "KRAFTSTOFF":"Diesel",
  "MENGE":"500",
  "EINHEIT":"L"
}
```

---

## EmissionRecord

Normalized emissions object used in analyst review workflow.

Fields:

* `organization` -> linked organization
* `raw_record` -> source raw row
* `scope` -> Scope 1 / 2 / 3 
* `category` -> Fuel / Electricity / Travel
* `activity_type` -> Diesel / Flight / Cab etc.
* `quantity` -> original quantity
* `unit` -> original unit
* `normalized_quantity` -> converted standardized quantity
* `normalized_unit` -> standardized unit
* `co2e` -> calculated emissions estimate
* `suspicious` -> anomaly flag
* `suspicious_reason` -> why row was flagged
* `status` -> review / approved / rejected
* `is_locked` -> prevents post-review edits
* `approved_at` -> approval timestamp
* `created_at` -> creation timestamp

Scope 1 -> SAP exports
Scope 2 -> Utility billing exports
Scope 3 -> Travel reports

Purpose:

* provide a unified structure for analyst review
* normalize different source formats into one schema

Example:

* gallons converted to liters
* travel rows converted into distance-based emissions
* suspicious records flagged for analyst review

---

## AuditLog

Tracks analyst actions on records.

Fields :

* `record` -> linked EmissionRecord
* `action` -> approved / rejected
* `performed_by` -> analyst identifier
* `timestamp` -> action timestamp

Purpose:

* maintain review traceability
* track approval/rejection history

---

# Why RawRecord and EmissionRecord are Separate

I intentionally separated raw ingestion rows from normalized emissions rows.

Reason:

* raw uploaded payload should remain unchanged
* normalization logic may evolve later
* analysts may need original source context
* failed ingestion rows can still be inspected

Pipeline flow:

```text id="1k0xk0"
CSV Upload
   |
DataSource
   |
RawRecord
   |
Normalization
   |
EmissionRecord
   |
Analyst Review
```

This separation makes the ingestion pipeline easier to debug and extend later.
