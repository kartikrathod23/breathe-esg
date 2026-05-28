# ESG Emissions Review System

A prototype ESG ingestion and analyst review workflow built for the Breathe ESG internship assignment.

The system supports:

* multi-source CSV ingestion
* emissions normalization
* suspicious activity detection
* analyst review workflows
* audit logging
* failed row tracking

Current supported ingestion sources:

* SAP fuel exports
* utility electricity reports
* corporate travel data

---

# Tech Stack

## Backend

* Django
* Django REST Framework
* SQLite

## Frontend

* React
* TypeScript
* Vite
* TailwindCSS

---

# Project Structure

```text
backend/
frontend/
docs/
```

---

# Features

## Ingestion

* CSV upload support
* source-specific parsing
* raw payload preservation
* failed row tracking

## Normalization

* unified emissions schema
* unit normalization
* CO2e estimation

## Suspicious Detection

Examples:

* negative fuel quantities
* unusually large electricity usage
* unrealistic travel distances

## Analyst Workflow

* review queue
* approve/reject actions
* immutable reviewed records
* audit logging

## Dashboard

* upload interface
* emissions table
* filtering
* metrics cards
* failed row visibility

---

# Backend Setup

## Clone repository

```bash
git clone https://github.com/kartikrathod23/breathe-esg
cd breathe-esg
```

---

## Move into backend

```bash
cd backend
```

---

## Create virtual environment

Windows (MSYS2 setup used during development):

```bash
python -m venv venv
venv/bin/activate
```

Some Windows setups may instead use:

```bash
venv\Scripts\activate
```

Mac/Linux:

```bash
python3 -m venv venv
source venv/bin/activate
```

---

## Install dependencies

```bash
pip install -r requirements.txt
```

---

## Create backend environment file

Copy the example environment file:

```bash
cp .env.example .env
```

Windows PowerShell alternative:

```powershell
Copy-Item .env.example .env
```

Update `.env`:

```env
DEBUG=True
SECRET_KEY=your_secret_key
ALLOWED_HOSTS=127.0.0.1,localhost
```

---

## Run migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

---

## Create demo organization

Open Django shell:

```bash
python manage.py shell
```

Run:

```python
from apps.organizations.models import Organization

Organization.objects.create(
    id=1,
    name="Demo Company"
)
```

Exit shell:

```python
exit()
```

---

## Start backend server

```bash
python manage.py runserver
```

Backend runs on:

```text
http://127.0.0.1:8000
```

---

# Frontend Setup

Open another terminal.

---

## Move into frontend

```bash
cd frontend
```

---

## Install dependencies

```bash
npm install
```

---

## Create frontend environment file

Copy the example file:

```bash
cp .env.example .env
```

Windows PowerShell alternative:

```powershell
Copy-Item .env.example .env
```

Update `.env`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

---

## Start frontend

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# Example CSV Formats

## SAP Fuel Data

```csv
WERK,KRAFTSTOFF,MENGE,EINHEIT
PLT01,Diesel,500,L
PLT02,Petrol,120,GAL
PLT03,Diesel,-100,L
PLT04,Petrol,999999,L
```

---

## Utility Data

```csv
Meter ID,Billing Start,Billing End,kWh,Tariff
MTR01,2026-05-01,2026-05-31,4000,Industrial
MTR02,2026-05-01,2026-05-31,70000,Industrial
```

---

## Travel Data

```csv
Employee Name,Travel Type,Origin,Destination,Distance
John Doe,Flight,DEL,BOM,1200
Alice,Cab,Bangalore Airport,Office,25000
Bob,Hotel,Mumbai,Mumbai,3
```

---

# Main API Endpoints

## Upload CSV

```http
POST /api/upload/
```

Form data:

* organization_id
* source_type
* file

---

## Get records

```http
GET /api/reviews/records/
```

Optional query params:

* `status=approved`
* `status=rejected`
* `suspicious=true`

---

## Approve record

```http
POST /api/reviews/approve/<record_id>/
```

---

## Reject record

```http
POST /api/reviews/reject/<record_id>/
```

---

## Failed ingestion rows

```http
GET /api/reviews/failed-rows/
```

---

# Assumptions

* Prototype uses a single seeded organization (`organization_id=1`)
* Authentication/RBAC is intentionally simplified
* CO2e factors are simplified
* Suspicious detection is rule-based
* CSV is the only supported ingestion format

More details are documented in:

* `docs/MODEL.md`
* `docs/DECISIONS.md`
* `docs/TRADEOFFS.md`
* `docs/SOURCES.md`

---

# Future Improvements

Some things intentionally left out for prototype scope:

* authentication and RBAC
* async ingestion workers
* external emissions factor datasets
* Excel/PDF ingestion
* advanced anomaly detection
* organization onboarding flows

---

# Notes

The focus of this implementation was:

* ingestion architecture
* normalization workflow
* reviewability
* auditability

rather than building a fully productionized ESG platform.
