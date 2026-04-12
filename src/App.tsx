import React from 'react';
import { useIsMobile } from './hooks/useMediaQuery';
import { DesktopLayout } from './components/layout/DesktopLayout';
import { MobileLayout } from './components/layout/MobileLayout';
import { EditorProvider } from './contexts/EditorContext';
import { WorkspaceProvider } from './contexts/WorkspaceContext';

function AppContent() {
  const isMobile = useIsMobile();
  return isMobile ? <MobileLayout /> : <DesktopLayout />;
}

export default function App() {
  return (
    <EditorProvider>
      <WorkspaceProvider>
        <AppContent />
      </WorkspaceProvider>
    </EditorProvider>
  );
}

