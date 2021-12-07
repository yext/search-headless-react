import { useCallback, useEffect, useState } from 'react';
import RecentSearches from "recent-searches";

const RECENT_SEARCHES_KEY = '__yxt_recent_searches__'

export default function useRecentSearches(
  recentSearchesLimit: number
): [RecentSearches|undefined, () => void, () => void] {
  const [ recentSearches, setRecentSeaches ] = useState<RecentSearches>();
  const removeRecentSearchesStorage = useCallback(() => {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  }, []);

  const createNewRecentSearchesStorage = useCallback(() => {
    setRecentSeaches(new RecentSearches({
      limit: recentSearchesLimit,
      namespace: RECENT_SEARCHES_KEY 
    }));
  }, [recentSearchesLimit]);
  
  useEffect(() => {
    setRecentSeaches(new RecentSearches({
      limit: recentSearchesLimit,
      namespace: RECENT_SEARCHES_KEY 
    }));
  }, [recentSearchesLimit]);

  return [recentSearches, createNewRecentSearchesStorage, removeRecentSearchesStorage];
}