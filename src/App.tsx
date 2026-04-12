import React from 'react';
import { useIsMobile } from './hooks/useMediaQuery';
import { DesktopLayout } from './components/layout/DesktopLayout';
import { MobileLayout } from './components/layout/MobileLayout';
import { EditorProvider } from './contexts/EditorContext';
import { LibraryProvider } from './contexts/LibraryContext';
import { UIProvider } from './contexts/UIContext';

function AppContent() {
  const isMobile = useIsMobile();
  return isMobile ? <MobileLayout /> : <DesktopLayout />;
}

export default function App() {
  return (
    <EditorProvider>
      <LibraryProvider>
        <UIProvider>
          <AppContent />
        </UIProvider>
      </LibraryProvider>
    </EditorProvider>
  );
}

