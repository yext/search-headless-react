import { MutableRefObject, useRef, useState } from "react";
import { AutocompleteResponse, useAnswersActions } from '@yext/answers-headless-react';

export function useAutocomplete(
  isVertical: boolean
): [ AutocompleteResponse|undefined, MutableRefObject<Promise<void>>, () => Promise<void> ] {
  const answersActions = useAnswersActions();
  const autocompleteNetworkIds = useRef({ latestRequest: 0, responseInState: 0 });
  const [ autocompleteResponse, setAutocompleteResponse ] = useState<AutocompleteResponse>();
  const latestAutocompleteResponseRef = useRef<Promise<void>>(Promise.resolve());
  async function executeAutocomplete () {
    const requestId = ++autocompleteNetworkIds.current.latestRequest;
    latestAutocompleteResponseRef.current = new Promise(async (resolve) => {
      const response = isVertical
        ? await answersActions.executeVerticalAutocomplete()
        : await answersActions.executeUniversalAutocomplete();
      if (requestId >= autocompleteNetworkIds.current.responseInState) {
        setAutocompleteResponse(response);
        autocompleteNetworkIds.current.responseInState = requestId;
        if (requestId === autocompleteNetworkIds.current.latestRequest) {
          resolve();
        }
      }
    });
  }
  return [ autocompleteResponse, latestAutocompleteResponseRef, executeAutocomplete ]
};