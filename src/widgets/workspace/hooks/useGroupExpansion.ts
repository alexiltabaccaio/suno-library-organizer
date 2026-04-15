import React, { useState, useEffect, useCallback } from 'react';

export const useGroupExpansion = () => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Handle group key changes to preserve expanded state
  useEffect(() => {
    const handleGroupRenamed = (e: any) => {
      const { oldKey, newKey } = e.detail;
      setExpandedGroups(prev => {
        if (prev.has(oldKey)) {
          const next = new Set(prev);
          next.delete(oldKey);
          next.add(newKey);
          return next;
        }
        return prev;
      });
    };

    window.addEventListener('groupRenamed', handleGroupRenamed);
    return () => window.removeEventListener('groupRenamed', handleGroupRenamed);
  }, []);

  const toggleGroup = useCallback((e: React.MouseEvent, key: string) => {
    e.stopPropagation();
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  return {
    expandedGroups,
    setExpandedGroups,
    toggleGroup
  };
};
