# Frontend to Backend Mapping

This document maps out the specific flow of data from the frontend React components all the way through to the backend Python agents, databases, and LLM models. 

## 1. Master Evaluation Flow (Dashboard & Analysis Pages)

**Frontend Component**: `src/pages/Analysis.jsx` (Also used by global alerts in `Dashboard.jsx`)
**React Query Hook**: `useSafetyEval()` (in `src/hooks/api/useEval.js`)
**API Service**: `src/services/eval.service.js` $\rightarrow$ `evaluateSafety(payload)`
**Backend Route**: `POST /api/eval` (FastAPI)
**LangGraph Orchestrator**: `master_flow.py` $\rightarrow$ `flow_app.invoke(state)`
**Agents Triggered**:
- `SensorAgent` (LSTM Autoencoder Model)
- `CVAgent` (Normalizes Vision JSON)
- `PermitAgent` (Checks `PlantGraph` NetworkX for SIMOPS)
- `RiskFusionEngine` (Computes mathematical risk score)
- `RAGAgent` (Queries `ChromaDB` and Google Gemini LLM if Score >= 0.50)
**Final Response mapped back to UI**:
- The component receives the full `AgentState` object.
- The UI maps `risk_fusion_out` into the gauge/score charts.
- The UI maps `rag_compliance_out.recommended_actions` into the action cards.

## 2. Live Sensor Telemetry Flow

**Frontend Component**: `src/pages/Sensors.jsx`
**React Query Hook**: `useSensorData()` (in `src/hooks/api/useSensors.js`)
**API Service**: `src/services/sensor.service.js` $\rightarrow$ `runSensorAgent(payload)`
**Backend Route**: `POST /api/agents/sensor`
**Agent Triggered**: `SensorAgent`
**Model Interacted**: PyTorch `LSTMAutoencoder` loaded with `data/lstm_weights.pth`
**Response mapped back to UI**:
- Component receives `sensor_anomaly_out`.
- Maps `current_value` to real-time charts (Recharts).
- Maps `anomaly_score` and `severity` into UI Warning indicators.

## 3. Permit Management & Conflict Detection Flow

**Frontend Component**: `src/pages/Permits.jsx`
**React Query Hook**: `usePermitIntel()` (in `src/hooks/api/usePermits.js`)
**API Service**: `src/services/permit.service.js` $\rightarrow$ `runPermitAgent(payload)`
**Backend Route**: `POST /api/agents/permit`
**Agent Triggered**: `PermitAgent`
**Database Interacted**: `PlantGraph` (In-memory NetworkX directed graph)
**Response mapped back to UI**:
- Component receives `permit_intel_out`.
- Maps `conflicts` array to a Data Table showing OISD-105 violations and spatial SIMOPS overlaps.

## 4. Computer Vision Detections Flow

**Frontend Component**: CV View (Inside Analysis or Dashboard)
**React Query Hook**: `useCVDetections()` (in `src/hooks/api/useCV.js`)
**API Service**: `src/services/cv.service.js` $\rightarrow$ `runCVAgent(payload)`
**Backend Route**: `POST /api/agents/cv`
**Agent Triggered**: `CVAgent`
**Response mapped back to UI**:
- Component receives `cv_safety_out`.
- Maps `violations` to bounding-box overlays and alert timelines.

## 5. System Health Dashboard Flow

**Frontend Component**: Settings / Admin Health
**React Query Hook**: `useSystemHealth()`
**API Service**: `src/services/dashboard.service.js` $\rightarrow$ `getSystemHealth()`
**Backend Route**: `GET /health`
**Response mapped back to UI**:
- System up/down metrics.
