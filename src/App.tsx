import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HydrasyncProvider } from './context/HydrasyncContext.tsx';
import { AppLayout } from './layouts/AppLayout.tsx';
import { Landing } from './pages/Landing.tsx';
import { Login } from './pages/Login.tsx';
import { Dashboard } from './pages/Dashboard.tsx';
import { Network } from './pages/Network.tsx';
import { Monitoring } from './pages/Monitoring.tsx';
import { Alerts } from './pages/Alerts.tsx';
import { Analytics } from './pages/Analytics.tsx';
import { Financials } from './pages/Financials.tsx';
import { Scenarios } from './pages/Scenarios.tsx';
import { Reports } from './pages/Reports.tsx';
import { Sensors } from './pages/Sensors.tsx';
import { Settings } from './pages/Settings.tsx';

export default function App() {
  return (
    <HydrasyncProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing & Authentication */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          {/* Operational Application Console (Shared Layout) */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/network" element={<Network />} />
            <Route path="/monitoring" element={<Monitoring />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/financials" element={<Financials />} />
            <Route path="/scenarios" element={<Scenarios />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/sensors" element={<Sensors />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </HydrasyncProvider>
  );
}
