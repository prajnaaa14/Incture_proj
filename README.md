# Procurement Enterprise Console

A modern enterprise-style React application built with Vite, Material UI, Redux Toolkit, React Router, and Recharts. This project simulates a procurement and operations command center with authentication, dashboards, workflow modules, and responsive UI patterns.

## Overview

This application provides a polished admin-style experience for managing procurement activities, vendor governance, compliance tracking, approvals, notifications, and reporting within a fictional enterprise environment.

## Features

- Responsive enterprise dashboard with KPI summaries and charts
- Protected authentication flow with login, forgot password, and reset password pages
- Procurement workspace with search, filters, and detail views
- Vendor governance and risk visibility modules
- Compliance, audit, approvals, notifications, and reporting pages
- Snackbar notifications, loading states, and confirmation dialogs
- Role-based access and route protection
- Redux-powered state management with persistence support

## Tech Stack

- React 19
- Vite
- Material UI
- Redux Toolkit
- React Router DOM
- Axios
- React Hook Form
- Yup
- Recharts
- Jest and React Testing Library

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Run locally

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Run tests

```bash
npm test -- --runInBand
```

## Demo Login Credentials

The app uses mock users for demonstration purposes.

- Admin: ash a.rao@enterprise.com / Admin123!
- Manager: mina.chen@enterprise.com / Manager123!
- Employee: daniel.brooks@enterprise.com / Employee123!
- Compliance Officer: priya.shah@enterprise.com / Compliance123!
- Auditor: leo.martin@enterprise.com / Auditor123!

## Deployment

The project is configured for deployment on Netlify.
inctureproj.netlify.app

### Netlify build settings

- Build command: npm run build
- Publish directory: dist

## Project Structure

- src/pages for application pages
- src/components for reusable UI components
- src/store for Redux slices and store setup
- src/services for API integration
- src/mocks for mock data
- src/routes for routing configuration

## Notes

This application is designed as a demo/prototype enterprise console and uses mock data rather than a live backend.
