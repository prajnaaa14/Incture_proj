# e-GRCP: Enterprise Governance, Risk, and Compliance Platform

An enterprise-grade frontend application designed to manage procurement workflows, vendor governance, risk posture, and corporate compliance.

**Live URL**: `inctureproj.netlify.app`  
**GitHub Repository**: `https://github.com/prajnaaa14/Incture_proj.git`

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
| **Admin** | `admin@enterprise.com` | `password123` |
| **Manager** | `manager@enterprise.com` | `password123` |
| **Employee** | `employee@enterprise.com` | `password123` |
| **Auditor** | `auditor@enterprise.com` | `password123` |


---

## 🎬 Project Demo & User Flows

Follow these interactive walkthroughs to demo the key enterprise workflows in the platform:

### Workflow 1: End-to-End Procurement Request & Approval (RBAC Demo)
1. **Submit Request (Employee)**:
   - Log in using Employee credentials (`employee@enterprise.com` / `password123`).
   - Go to the **Procurement Workspace** using the sidebar.
   - Click the **Create Request** button at the top right.
   - In the dialog, enter Title: `MacBook Pro 16 Upgrade`, Estimated Amount: `3500`, and select Department: `IT`.
   - Click **Submit Request**. The new request will appear in the table with a `Pending` status.
   - Log out by clicking your user profile avatar in the header.
2. **Approve Request (Manager)**:
   - Log in using Manager credentials (`manager@enterprise.com` / `password123`).
   - Navigate to the **Approvals Workbench** (exclusive to Managers and Admins).
   - Locate the `MacBook Pro 16 Upgrade` request in the queue.
   - Click **Approve** on the row. The request status will transition to `Approved` and update live in the database.
   - Alternatively, you can click **Reject**, **Send Back** (for corrections), or **Delegate** to another user.
3. **Trace Logs (Auditor/Admin)**:
   - Log out and log back in using Auditor credentials (`auditor@enterprise.com` / `password123`).
   - Go to the **Audit Center** (exclusive to Auditors and Admins).
   - In the audit logs list, you will see a system record of the `MacBook Pro 16 Upgrade` request being created and subsequently approved by the Manager, maintaining a tamper-proof audit trail.

### Workflow 2: Risk Scoring & Heat Map Interaction
1. Log in using Admin credentials (`admin@enterprise.com` / `password123`).
2. Navigate to the **Risk Center** in the sidebar.
3. Observe the dynamic 5x5 **Likelihood vs. Impact Matrix**:
   - Hover over cells to see risk distributions.
   - Scroll down to view the detailed **Risk Register** listing active vulnerabilities, mitigation strategies, and status.
   - Filter risks by Category (e.g., Financial, Cybersecurity, Operational) using the search and status controllers.

### Workflow 3: Compliance Monitoring & Violations
1. Navigate to the **Compliance Center**.
2. Review the status of standard corporate policies, active violations, and expired certifications.
3. Review the quick filters to view violations matching policies like `ISO 27001`, `GDPR`, or `SOC 2`.

### Workflow 4: Executive Reporting & Exports
1. Navigate to the **Reporting Center** in the sidebar.
2. Under the list of categories, select a report format (e.g., Procurement Pipeline or Risk Register).
3. Click the **Export CSV** or **Export Excel** button. The application will compile the active dataset and download the CSV/Excel files directly.

### Workflow 5: System Themes & Preferences
1. Click the **User Settings** tab in the sidebar (or click Settings in the avatar dropdown menu).
2. Navigate to the **Theme** tab.
3. Toggle between **Light Mode** and **Dark Mode**. The application instantly transitions colors, backgrounds, and chart colors using the native React Theme Context.

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

---

## 🧪 Testing & Scoped Coverage

The application includes a comprehensive test suite (12 test suites, 34 test cases) covering Redux slices, route guards, layouts, form validation, and complex page workflows. The suite is fully compatible with both **Jest** and **Vitest** test runners.

### Test Coverage Thresholds
The testing framework enforces a strict coverage threshold of **80%** across all major metrics:
- **Statements**: 94.8%
- **Branches**: 83.6%
- **Functions**: 90.1%
- **Lines**: 94.6%

### Running Tests

#### 1. Run Tests with Jest
To run the full test suite in single-band execution with Jest:
```bash
npm test
```

#### 2. Run Tests & Coverage with Vitest
To run the tests and generate a detailed coverage report using Vitest and the `v8` provider:
```bash
npm run coverage
```

#### 3. Run Development Watch Mode
To run Vitest in interactive watch mode for rapid iteration:
```bash
npx vitest
```

