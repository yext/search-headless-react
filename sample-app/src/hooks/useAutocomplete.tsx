import { MutableRefObject, useRef, useState } from "react";
import { AutocompleteResponse, useAnswersActions } from '@yext/answers-headless-react';

export function useAutocomplete(
  isVertical: boolean
): [ 
    AutocompleteResponse|undefined,
    MutableRefObject<Promise<AutocompleteResponse|undefined>>,
    () => Promise<void> 
  ]
{
  const answersActions = useAnswersActions();
  const autocompleteNetworkIds = useRef({ latestRequest: 0, responseInState: 0 });
  const [ autocompleteResponse, setAutocompleteResponse ] = useState<AutocompleteResponse>();
  const responseToLatestRequestRef = useRef<Promise<AutocompleteResponse|undefined>>(Promise.resolve(undefined));
  async function executeAutocomplete () {
    const requestId = ++autocompleteNetworkIds.current.latestRequest;
    responseToLatestRequestRef.current = new Promise(async (resolve) => {
      const response = isVertical
        ? await answersActions.executeVerticalAutocomplete()
        : await answersActions.executeUniversalAutocomplete();
      if (requestId >= autocompleteNetworkIds.current.responseInState) {
        setAutocompleteResponse(response);
        autocompleteNetworkIds.current.responseInState = requestId;
      }
      resolve(response);
    });
  }
  return [ autocompleteResponse, responseToLatestRequestRef, executeAutocomplete ]
};