# Frontend Gap Analysis

This document identifies the discrepancies between the existing React frontend implementation and the true capabilities of the SafeOps-AI backend. The goal is to outline everything missing that must be built to achieve full enterprise integration.

## 1. Data Hardcoding vs. Dynamic API Integration
**Current State**: The frontend heavily relies on mocked data arrays (e.g., `safetyData` in `Dashboard.jsx`, `timeData` in `Sensors.jsx`).
**Backend Reality**: The backend has real endpoints (`/api/eval`, `/api/agents/sensor`, `/api/agents/cv`, etc.) that return complex, nested JSON objects (e.g., `sensor_anomaly_out`, `risk_fusion_out`).
**Gap**: 
- Missing `axios` or `fetch` integration.
- Missing `@tanstack/react-query` hooks for data fetching, caching, and polling.
- Missing Pydantic-equivalent TypeScript interfaces to validate incoming data on the client side.

## 2. Global State & Context
**Current State**: Basic `AuthProvider` exists, but there is no context for real-time plant state (e.g., current active zone, global alerts).
**Backend Reality**: The backend processes state per zone (`zone_id`), and calculates compound risk across multiple agents.
**Gap**: 
- Need a `PlantStateProvider` or similar to manage the active zone being monitored.
- Need WebSocket or long-polling integration for real-time anomaly alerts (currently, backend supports POST for evaluation, so we need polling).

## 3. Missing Dashboards & Views
**Current State**: 
- `Dashboard.jsx`: Shows high-level mock stats.
- `Sensors.jsx`: Shows mock temperature charts.
- `Analysis.jsx`: Shows a 3-step file upload UI with mock progress.
- `Permits.jsx`: (Not fully reviewed, likely mock data).
**Backend Reality**: The backend supports RAG Incident Compliance, CV Bounding Box Detections, and Permit Spatial Conflicts.
**Gap**:
- **CV Dashboard View**: Missing a component to render raw camera frames overlaid with YOLO bounding boxes (using data from `cv_safety_out`).
- **Permit Conflict View**: Missing a UI to show spatial overlaps and OISD-105 violations (using data from `permit_intel_out`).
- **RAG Copilot View**: Missing a dedicated UI in `Analysis` or `Dashboard` to render the Gemini LLM's recommended actions and cited regulatory sources (`rag_compliance_out`).

## 4. API Error Handling & Loading States
**Current State**: Basic suspense loader exists. `Analysis.jsx` has some loading states but they are mocked via `setTimeout`.
**Backend Reality**: The backend can return HTTP 500s if LangGraph fails, or mock fallbacks if `GEMINI_API_KEY` is missing.
**Gap**:
- Missing generic API error boundaries.
- Missing robust toast notifications linked to actual network failures.
- Missing skeleton loaders for charts while data is fetching.

## 5. Architectural Scaffolding
**Current State**: A `.jsx` based Vite project. Folders exist but lack strict typing and service layers.
**Gap**:
- No `tsconfig.json`.
- Missing `/services` folder for API logic.
- Missing `/types` folder for TypeScript schemas matching backend Pydantic models.
- Missing `/hooks/api` for React Query wrappers.
