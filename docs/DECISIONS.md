## Why CSV-based ingestion

I kept ingestion CSV-first because most enterprise exports still end up as flat files at some stage.

Examples:

* SAP exports
* utility billing exports
* travel reports

CSV uploads also make the prototype easier to test without depending on external APIs or credentials.

For the scope of this assignment, CSV ingestion provided the fastest way to focus on:

* normalization
* review workflow
* suspicious detection
* auditability

instead of spending most of the implementation on authentication and third-party integrations.

---

## Why raw and normalized records are separated

I intentionally separated:

* `RawRecord`
* `EmissionRecord`

The uploaded payload is preserved exactly as received, while normalized records are used for analyst review.

This helps with:

* debugging ingestion issues
* preserving source-of-truth data
* supporting evolving normalization rules
* tracing records back to original uploads

I did not want normalization logic to overwrite original source structure.

---

## Why suspicious detection is rule-based

I chose deterministic rules instead of ML-based anomaly detection.

Examples:

* negative fuel quantities
* extremely large electricity usage
* unrealistic travel distances

Reason:

* prototype scope
* explainability
* easier analyst review
* easier debugging

For this stage, simple transparent rules felt more practical than introducing a black-box model.

---

## Why analyst actions lock records

Once a record is approved or rejected:

* it becomes locked

I added this because audit workflows should avoid silent edits after review decisions.

This also makes the audit log more meaningful.

---

## Why rejected records are not deleted

Rejected rows are intentionally preserved instead of deleted.

Reason:

* auditability
* traceability
* analyst review history

In ESG/compliance workflows, even invalid records can still be operationally important.

---

## Why I used a unified emissions schema

Different source systems use different formats.

Examples:

* SAP fuel exports
* utility meter reports
* travel activity data

Instead of exposing source-specific structures to analysts, I normalize everything into a common emissions object.

This keeps the review workflow consistent regardless of ingestion source.

---

## Why organization support is lightweight

The assignment mentions multi-tenancy, so I introduced an `Organization` model and linked all major records to it.

I intentionally kept authentication and RBAC minimal because the focus of the assignment felt more centered around:

* ingestion architecture
* normalization
* review workflow

rather than identity management.

---

## Why failed rows are stored separately

I wanted ingestion failures to remain visible instead of silently disappearing.

Failed rows include:

* original payload
* failure status
* error message

This helps analysts understand:

* what failed
* why it failed
* which source row caused the issue

instead of forcing them to inspect logs manually.

---

## Why the frontend focuses on workflow over design

I intentionally kept the UI simple and operational.

Main focus areas:

* upload flow
* suspicious highlighting
* analyst review actions
* filtering
* metrics
* failed row visibility

The goal was to prioritize usability and workflow clarity over building a visually heavy dashboard.
