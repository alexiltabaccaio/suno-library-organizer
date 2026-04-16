import { useState } from 'react';

export interface Filters {
  liked: boolean;
  disliked: boolean;
  hideDisliked: boolean;
}

export const useFilterLogic = () => {
  const [filters, setFilters] = useState<Filters>({
    liked: false,
    disliked: false,
    hideDisliked: false
  });
  
  const [subFilters, setSubFilters] = useState<Filters>({
    liked: false,
    disliked: false,
    hideDisliked: false
  });
  
  const [groupPages, setGroupPages] = useState<Record<string, number>>({});

  const toggleFilter = (key: keyof Filters) => {
    setFilters(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleSubFilter = (key: keyof Filters) => {
    setSubFilters(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const setGroupPage = (groupKey: string, page: number) => {
    setGroupPages(prev => ({
      ...prev,
      [groupKey]: page
    }));
  };

  return {
    filters,
    setFilters,
    toggleFilter,
    subFilters,
    setSubFilters,
    toggleSubFilter,
    groupPages,
    setGroupPage
  };
};
