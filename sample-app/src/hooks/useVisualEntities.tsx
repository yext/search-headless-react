import { useRef, useState } from "react";
import { provideAnswersHeadless, VerticalResults, AnswersHeadless, UniversalLimit } from '@yext/answers-headless-react';
import { ANSWERS_CONFIG } from '../utils/constants';
import useDebouncedFunction from './useDebouncedFunction';

interface VisualEntitiesState {
  verticalResultsArray: VerticalResults[],
  isLoading: boolean
}

type ExecuteVisualEntitiesQuery = (query: string, universalLimit: UniversalLimit) => void

/**
 * useVisualEntities provides state surrounding the visual entities portion of visual autocomplete,
 * which performs debounced universal searches.
 * 
 * @param headlessId a unique id for the new headless instance that will be created by the hook
 * @param debounceTime the time in milliseconds to debounce the universal search request
 */
export function useVisualEntities(headlessId: string, debounceTime: number):[ VisualEntitiesState, ExecuteVisualEntitiesQuery ] {
  const headlessRef = useRef<AnswersHeadless>();
  if (!headlessRef.current) {
    headlessRef.current = provideAnswersHeadless({
      ...ANSWERS_CONFIG,
      headlessId
    });
  }
  const [verticalResultsArray, setVerticalResultsArray] = useState<VerticalResults[]>([]);
  const debouncedUniversalSearch = useDebouncedFunction(async () => {
    if (!headlessRef.current) {
      return;
    }
    await headlessRef.current.executeUniversalQuery();
    const results = headlessRef.current.state.universal.verticals || [];
    setVerticalResultsArray(results);
    setLoadingState(false);
  }, debounceTime)
  const [isLoading, setLoadingState] = useState<boolean>(false);

  function executeVisualEntitiesQuery(query: string, universalLimit: UniversalLimit) {
    if (!headlessRef.current) {
      return;
    }
    if (query === headlessRef.current.state.query.input) {
      return;
    }
    setLoadingState(true);
    headlessRef.current.setQuery(query);
    headlessRef.current.setUniversalLimit(universalLimit);
    debouncedUniversalSearch();
  }
  return [{ verticalResultsArray, isLoading }, executeVisualEntitiesQuery];
};