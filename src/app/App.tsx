import React from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { FleetProvider } from '@/app/lib/store';
import { Toaster } from '@/app/components/ui/sonner';

export default function App() {
  return (
    <FleetProvider>
      <RouterProvider router={router} />
      <Toaster />
    </FleetProvider>
  );
}
