import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar.tsx';
import { Header } from './Header.tsx';
import { ToastContainer } from '../components/ToastContainer.tsx';
import { SectionDetailModal } from '../components/SectionDetailModal.tsx';
import { IncidentDetailModal } from '../components/IncidentDetailModal.tsx';
import { useHydrasync } from '../context/HydrasyncContext.tsx';

export const AppLayout: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const {
    selectedSection,
    setSelectedSection,
    selectedAlert,
    setSelectedAlert,
    resolveAlert,
    dismissAlert,
  } = useHydrasync();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex">
      {/* Persistent Sidebar */}
      <Sidebar
        isOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Persistent Header */}
        <Header onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

        {/* Dynamic Routed Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
          <Outlet />
        </main>
      </div>

      {/* Global Modals for Section & Incident Drill-down */}
      <SectionDetailModal
        section={selectedSection}
        onClose={() => setSelectedSection(null)}
      />

      <IncidentDetailModal
        alert={selectedAlert}
        onClose={() => setSelectedAlert(null)}
        onResolve={resolveAlert}
        onDismiss={dismissAlert}
      />

      {/* Real-time System Toast Notifications */}
      <ToastContainer />
    </div>
  );
};
