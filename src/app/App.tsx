import React from 'react';
import { useIsMobile } from '@/shared/hooks/useMediaQuery';
import { useGlobalShortcuts } from './hooks/useGlobalShortcuts';
import { DesktopLayout } from '@/widgets/layout/ui/DesktopLayout';
import { MobileLayout } from '@/widgets/layout/ui/MobileLayout';

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

