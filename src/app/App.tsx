import React from 'react';
import { useIsMobile } from '../shared/hooks/useMediaQuery';
import { DesktopLayout } from './layouts/DesktopLayout';
import { MobileLayout } from './layouts/MobileLayout';
import { EditorProvider } from '../features/editor/model/EditorContext';
import { LibraryProvider } from '../features/library/model/LibraryContext';
import { UIProvider } from '../features/ui/model/UIContext';

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

