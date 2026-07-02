# e-GRCP: Enterprise Governance, Risk, and Compliance Platform

An enterprise-grade frontend application designed to manage procurement workflows, vendor governance, risk posture, and corporate compliance.

**Live URL**: `[Insert your Netlify URL here]`  
**GitHub Repository**: `[Insert your GitHub Repo URL here]`

---

## 🏗 Technology Stack

- **Core**: React 19, Vite
- **Routing**: React Router v6 (Nested routes, Protected routes, Role-Based Route Guards)
- **State Management**: Redux Toolkit & React-Redux
- **Data Persistence**: Redux Persist (localStorage caching)
- **UI & Layout**: Material-UI (MUI v5)
- **Charting**: Recharts
- **Forms & Validation**: React Hook Form, Yup
- **Networking/HTTP**: Axios (Centralized `apiClient.js` with Interceptors)
- **Data Strategy**: Mock JSON Services & Simulated Async APIs (`createAsyncThunk`)

---

## 🔑 Demo Credentials (Mock Users)

The application utilizes strict Role-Based Access Control (RBAC). Log in with the following accounts to experience dynamic dashboard filtering and route protection.

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@enterprise.com` | `Password123!` |
| **Manager** | `manager@enterprise.com` | `Password123!` |
| **Employee** | `employee@enterprise.com` | `Password123!` |
| **Auditor** | `auditor@enterprise.com` | `Password123!` |

---

## 📦 Implemented Modules

1. **Authentication (Module 1)**: Login, Forgot Password, Reset Password, and Session Expiry simulated flows.
2. **Executive Dashboard (Module 2)**: Business overview with KPI cards, activity timelines, and real-time interactive charting.
3. **Procurement Workspace (Module 3)**: Request submission workflows, approval history, audit logging, and data grid filtering.
4. **Vendor Governance (Module 4)**: Supplier list filtering and dedicated Vendor profiles showing risk scores, documents, and history.
5. **Risk Center (Module 5)**: 5x5 Likelihood vs. Impact Heat Map, risk tracking grids, and category distributions.
6. **Compliance Center (Module 6)**: Tracking for open policy violations, missing documents, and expiring certifications.
7. **Audit Center (Module 7)**: Chronological system logs, user activity histories, and security logs with Export (PDF/CSV) capabilities.
8. **Approval Workbench (Module 8)**: Dedicated queues for Managers to Approve, Reject, Delegate, or Send Back pending procurement requests.
9. **Notification Center (Module 9)**: Real-time application alert hub with priority indicators and read/unread filtering.
10. **Reporting Center (Module 10)**: Snapshot exports of system modules into CSV and Excel formats.
11. **User Settings (Module 11)**: Configurable user preferences including Dark/Light mode theme switching and profile administration.

---

## 🛠 Local Development Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```

### 3. Build for Production (Netlify Deployment)
```bash
npm run build
```
*(Note: A `public/_redirects` file is included in this repository to automatically handle SPA client-side routing on Netlify).*

---

## 🛡 System Architecture Highlights

- **Global Error Handling**: Integrated `GlobalErrorBoundary.jsx` prevents the application from crashing out by rendering a graceful fallback UI on unexpected render failures.
- **API Interceptors**: Integrated `apiClient.js` automatically injects Auth Bearer tokens into headers and centralizes error handling (e.g., auto-logout on `401 Unauthorized` responses).
- **Responsive Enterprise Design**: Leverages standard layout architectures (Header/Sidebar/Main Content) mirroring industry-standard platforms like SAP, ServiceNow, and Salesforce.
