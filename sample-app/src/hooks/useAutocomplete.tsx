import { useRef, useState } from "react";
import { AutocompleteResult, useAnswersActions } from '@yext/answers-headless-react';

export function useAutocomplete(isVertical: boolean): [AutocompleteResult[], () => Promise<void>] {
  const answersActions = useAnswersActions();
  const autocompleteNetworkIds = useRef({ latestRequest: 0, responseInState: 0 });
  const [ autocompleteResults, setAutoCompleteResults ] = useState<AutocompleteResult[]>([]);
  async function executeAutocomplete () {
    const requestId = ++autocompleteNetworkIds.current.latestRequest;
    const response = isVertical
      ? await answersActions.executeVerticalAutocomplete()
      : await answersActions.executeUniversalAutocomplete();
    if (requestId >= autocompleteNetworkIds.current.responseInState) {
      setAutoCompleteResults(response?.results || []);
      autocompleteNetworkIds.current.responseInState = requestId;
    }
  }
  return [ autocompleteResults, executeAutocomplete ]
};