# TRADEOFFS.md

## Authentication and RBAC were intentionally not implemented

The current prototype does not implement:

* authentication
* login/signup flows
* RBAC (role-based access control)
* session management
* analyst/auditor accounts

Instead, the system currently operates using a single manually created organization record (`organization_id=1`) to test the ingestion and review workflow end-to-end.

I intentionally kept this lightweight because the assignment focus felt more centered around:

* ingestion architecture
* normalization
* suspicious detection
* analyst review workflow
* auditability

rather than identity management.

Even though authentication is not implemented yet, the core data model is already organization-aware:

* uploaded sources
* raw ingestion rows
* normalized emissions
* audit logs

all link back to an `Organization`.

In a production system I would likely extend this into:

* authenticated users
* organization-scoped access
* analyst/auditor roles
* JWT/session authentication
* permission checks
* organization onboarding flows
---

## Ingestion is synchronous

CSV ingestion currently runs during the upload request itself.
This keeps the implementation simple and easier to reason about for the prototype.
In a production environment I would likely move ingestion into:

* background workers
* queues
* async jobs

using something like Celery.

That would improve:

* retry handling
* large file support
* ingestion reliability

---

## Emission factors are simplified

The CO2e calculations currently use fixed hardcoded multipliers.

Example:

* diesel -> fixed multiplier
* electricity -> fixed multiplier

This was intentional for the assignment prototype.

Real ESG systems would likely use:

* region-specific emission factors
* versioned factor datasets
* external emissions databases
* time-dependent factors

The current implementation focuses more on ingestion and workflow architecture than emissions science accuracy.

---

## Suspicious detection is rule-based

Suspicious detection currently uses deterministic rules instead of ML models.

Examples:

* negative quantities
* unusually large values
* unrealistic travel distances

This approach is easier to:

* debug
* explain
* validate
* demonstrate during review

A production system could evolve toward:

* historical anomaly detection
* organization-specific thresholds
* ML-assisted review scoring

but I felt rule-based detection was more appropriate for the scope of this prototype.

---

## File formats are intentionally limited

The system currently supports CSV uploads only.

I intentionally did not implement:

* PDF extraction
* OCR pipelines
* Excel ingestion
* ERP APIs

because the ingestion architecture itself was the primary focus.

The normalization pipeline can later be extended to support additional ingestion adapters.

---

## Unit normalization is intentionally lightweight

Only a small subset of unit conversions is currently handled.

Examples:

* gallons -> liters

I intentionally avoided building a large conversion engine because the assignment focus appeared to be:

* ingestion flow
* data modeling
* review workflow

rather than complete scientific conversion coverage.

---

## Records are locked after review

Approved/rejected records become immutable.

This improves:

* auditability
* analyst traceability
* workflow consistency

The tradeoff is reduced flexibility if corrections are needed later.

A production system could instead introduce:

* revision history
* versioning
* reopen workflows

rather than strict locking.

---

## Rejected records are preserved instead of deleted

Rejected records remain stored in the system.

This increases audit traceability but also means invalid data still exists in storage.

I chose this intentionally because ESG/compliance workflows typically prioritize historical traceability over aggressive deletion.
