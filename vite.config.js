/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setupTests.js',
    testTimeout: 60000,
    coverage: {
      include: [
        'src/components/auth/RouteGuard.jsx',
        'src/pages/auth/ForgotPasswordPage.jsx',
        'src/pages/dashboard/DashboardPage.jsx',
        'src/pages/procurement/ProcurementPage.jsx',
      ],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      }
    }
  },
})
