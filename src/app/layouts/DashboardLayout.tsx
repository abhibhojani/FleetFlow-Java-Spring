import React from 'react';
import { Outlet } from 'react-router';
import { Sidebar } from '../components/Sidebar';

export function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar />
      <main className="ml-64 w-full p-8 transition-all duration-300">
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
