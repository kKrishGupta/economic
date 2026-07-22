# SafeOps AI Command Center (Frontend)

Welcome to the **SafeOps AI Command Center**, a premium, futuristic, enterprise-grade AI Operations Dashboard designed for Fortune 500 industrial plants. It serves as the "God-Level" real-time intelligence feed, providing plant administrators with actionable insights through advanced sensor fusion, computer vision, and RAG-based compliance intelligence.

## 🚀 Key Features

*   **Live Sensor Telemetry:** Real-time STOMP WebSocket integration streaming Core Temperature, Gas Concentration (% LEL), and Atmospheric Pressure across facility zones.
*   **AI Anomaly Detection:** Real-time monitoring leveraging PyTorch LSTM autoencoder reconstruction scores to predict and identify environmental drift and spikes (e.g., Gas Leaks).
*   **Computer Vision (CV) Safety:** Live feeds detecting PPE violations (e.g., missing helmets, missing high-visibility vests) with bounding boxes and confidence scores.
*   **Dynamic Permit Intelligence:** Automatic ingestion of active permits (Hot Work, Cold Work, Confined Space) and correlation against sensor anomalies to identify critical OISD-105 standard violations (e.g., Active Hot Work during a Gas Spike).
*   **RAG Compliance Engine:** Automatically cross-references safety incidents against historical databases and regulatory manuals (Factories Act 1948, OISD standards) to recommend immediate mitigation actions.
*   **Role-Based Access Control (RBAC):** Distinct `ADMIN` and `USER` views. Administrators can toggle dynamic simulation modes (`NORMAL`, `DRIFT`, `SPIKE`) to stress-test the system, which safely auto-resets to `NORMAL` upon logout.

## 🎨 Design & Architecture

The user interface has been completely transformed into a "World-Class AI Command Center", inspired by Palantir, Tesla, and Apple VisionOS:
*   **Aesthetic:** Dark mode native, glassmorphism panels (`backdrop-blur`), subtle glowing gradients, and dynamic noise/lighting effects.
*   **Motion & Interactivity:** Fluid micro-animations, hover-lift effects, and live pulsing badges powered by `framer-motion`.
*   **Data Visualization:** Sleek, animated line and bar charts using `recharts` to map continuous AI telemetry.

## 🛠️ Tech Stack

*   **Core:** React 18, Vite (Oxc compiler)
*   **Routing:** React Router DOM (v6)
*   **Styling:** Tailwind CSS (with custom utility classes and premium aesthetic overrides)
*   **State & Data Fetching:** React Query (`@tanstack/react-query`), Axios
*   **WebSockets:** `@stomp/stompjs` for real-time telemetry streaming
*   **Animations:** Framer Motion
*   **Icons:** Lucide React
*   **Form Validation:** React Hook Form + Zod

## ⚙️ Getting Started

### Prerequisites
*   Node.js (v18+ recommended)
*   npm or yarn

### Installation
1.  Navigate to the frontend directory:
    ```bash
    cd Frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure your environment variables (create a `.env` file based on the backend API URL):
    ```env
    VITE_API_URL=http://localhost:8080
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```

## 📂 Project Structure Overview

*   `/src/pages` - Core views (`Dashboard`, `Sensors`, `Permits`, `Profile`, `Register`, `Login`).
*   `/src/layouts` - Structural wrappers (`DashboardLayout`, `AuthLayout`, `LandingLayout`).
*   `/src/hooks` - Custom React Query hooks and WebSocket listeners (`useSafetySocket.js`, `useSimulator.js`).
*   `/src/services` - Axios API configurations and service classes (`admin.service.js`, `AuthService.js`).
*   `/src/validation` - Zod schema definitions (`auth.schema.js`).
*   `/src/components` - Reusable UI elements (Buttons, Inputs, Cards).

---
*Built for absolute precision, zero latency, and ultimate safety.*
