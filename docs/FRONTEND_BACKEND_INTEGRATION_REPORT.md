# Frontend-Backend Integration Report

**Date:** July 21, 2026
**Status:** COMPLETE (Enterprise-Grade Javascript Integration)

This report confirms the successful connection between the React frontend and the LangGraph FastAPI backend. As requested, the backend remains entirely untouched, and the frontend acts as a dynamic presentation and integration layer.

## 1. Pages Connected
- `[x]` **Dashboard (`Dashboard.jsx`)**: Connected to `/health` (via `useSystemHealth`). Dynamic risk score, active alerts, and RAG compliance insights pulled directly from the React Query cache of the latest evaluation.
- `[x]` **Analysis (`Analysis.jsx`)**: Connected to `/api/eval` (via `useSafetyEval`). Dispatches the massive `SafetyEvalRequest` payload and gracefully handles the LangGraph `AgentState` response, rendering Agent Cards and AI Recommendations.
- `[x]` **Sensors (`Sensors.jsx`)**: Connected to `/api/agents/sensor` (via `useSensorAnalysis`). Renders LSTM anomaly detection scores and updates Recharts dynamically based on backend drift warnings.
- `[x]` **Permits (`Permits.jsx`)**: Connected to `/api/agents/permit` (via `usePermitAnalysis`). Maps NetworkX spatial violations and SIMOPS conflicts into UI warning cards.
- `[x]` **Admin (`Admin.jsx`)**: Connected to `/health`. Displays a live system load AreaChart that polls every 2 seconds, providing a highly activated, dynamic view of backend health and AI invocations.

## 2. APIs Connected
- `GET /health` $\rightarrow$ `src/services/dashboard.service.js`
- `POST /api/eval` $\rightarrow$ `src/services/eval.service.js`
- `POST /api/agents/sensor` $\rightarrow$ `src/services/sensor.service.js`
- `POST /api/agents/cv` $\rightarrow$ `src/services/cv.service.js`
- `POST /api/agents/permit` $\rightarrow$ `src/services/permit.service.js`
- `POST /api/agents/rag` $\rightarrow$ `src/services/rag.service.js`

## 3. Services & Hooks Created
All services use a centralized Axios client (`src/services/api.js`) with global interceptors that automatically dispatch `react-hot-toast` notifications on 400/500 errors. 

**React Query Hooks (in `src/hooks/api/`)**:
- `useSystemHealth()`
- `useSafetyEval()`
- `useSensorAnalysis()`
- `useCVAnalysis()`
- `usePermitAnalysis()`
- `useRAGCompliance()`

## 4. Components Updated
- `DashboardLayout.jsx`: The Notification Bell is now dynamic. It listens to the `latestEval` query and pushes real-time toasts and drop-down notifications matching the exact severity (CRITICAL, HIGH, NORMAL) returned by the Risk Fusion Engine.

## 5. Types & Validation (JSDoc)
Per the user requirement to strictly use JavaScript (React + JSX) instead of TypeScript, all schemas have been explicitly mapped within the service payloads and component dispatchers using standardized JSON structures that precisely match the backend Pydantic models.

## Remaining TODO
- **Production Build**: Run `npm run build` to generate the Vite production bundle.
- **WebSocket Streaming**: If the backend evolves to support WebSockets for real-time camera frames (currently POST polling), the CV Dashboard view will need a dedicated Socket hook.
