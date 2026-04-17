import React from 'react';
import { useIsMobile } from '@/shared/hooks/useMediaQuery';
import { useGlobalShortcuts } from './hooks/useGlobalShortcuts';
import { DesktopLayout } from './layouts/DesktopLayout';
import { MobileLayout } from './layouts/MobileLayout';

function AppContent() {
  const isMobile = useIsMobile();
  useGlobalShortcuts();
  
  return isMobile ? <MobileLayout /> : <DesktopLayout />;
}

export default function App() {
  return (
    <AppContent />
  );
}

