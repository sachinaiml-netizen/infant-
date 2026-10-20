# Five-Theme Opportunity Lab

## Purpose

The /opportunity-lab page is an independent student proof of concept that consolidates five research-derived opportunity themes for a possible Prestige Group technical discussion. It is not an official Prestige product and is not evidence that any internal workflow is missing or underperforming.

## Module scope

| Theme | Demonstration | Current status |
|---|---|---|
| LaunchIQ | Weighted internal launch-readiness checklist with owners, target days and open-action explanations | Browser-side rules over synthetic data; no regulatory prediction |
| ConstructionIQ | Activity delay scenario, critical-path / float analysis and hypothetical recovery comparison | Uses the existing FastAPI deterministic CPM engine |
| DocumentIQ | Register checks for missing metadata, non-final review status and revision candidates | Browser-side rules over synthetic metadata; no document upload, OCR or LLM |
| VendorIQ | Delivery lateness, quantity shortfall and invoice variance exceptions | Browser-side rules over synthetic purchase-order records; no fraud classification |
| ServiceIQ | Filterable service queue, stated category counts and triage prompts | Browser-side rules over synthetic tickets; category is not AI-generated |

## Evidence and safety boundary

- All concept records, owners, quantities, costs, dates and projects shown in the four lighter modules are invented.
- ConstructionIQ's schedule engine also uses a synthetic activity network and explicit illustrative cost assumptions.
- No Autodesk, Primavera, ERP, RERA, customer-service or Prestige internal system is connected.
- No external approval is predicted; an exception is not proof of fraud or breach; no consequential action is automated.
- The page should be used to ask whether a narrow workflow adds value alongside existing tools, not to claim that Prestige lacks a capability.

## Technical design

- Frontend: standalone responsive HTML/CSS/JavaScript page served by FastAPI.
- Backend: existing /api/catalog and /api/scenario endpoints used by the ConstructionIQ module.
- Deployment route: GET /opportunity-lab; the existing GET / Project Impact Lab interface remains unchanged.
- The other four modules are client-side concept demonstrations. They are not yet persistence-backed applications, integrations, OCR systems or AI classifiers.

## Proposed validation sequence

1. Ask the business/process owner to describe the existing workflow, source of truth and known pain point.
2. Choose one target decision and baseline metric (for example, time to identify float erosion, document exception precision, or service-ticket triage time).
3. Use only explicitly approved, minimised sample data in an authorised environment.
4. Compare prototype outputs to current practice; report false positives, missed exceptions and cases needing human override.
5. Retain the module only if the test demonstrates incremental value and meets security, access-control and audit requirements.
