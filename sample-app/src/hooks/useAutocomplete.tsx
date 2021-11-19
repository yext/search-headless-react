import { useRef, useState } from "react";
import { AutocompleteResponse, useAnswersActions } from '@yext/answers-headless-react';

export function useAutocomplete(
  isVertical: boolean
): [ 
    AutocompleteResponse|undefined,
    () => Promise<AutocompleteResponse|undefined> 
  ]
{
  const answersActions = useAnswersActions();
  const autocompleteNetworkIds = useRef({ latestRequest: 0, responseInState: 0 });
  const [ autocompleteResponse, setAutocompleteResponse ] = useState<AutocompleteResponse>();
  async function executeAutocomplete (): Promise<AutocompleteResponse|undefined>  {
    const requestId = ++autocompleteNetworkIds.current.latestRequest;
    return new Promise(async (resolve) => {
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
  return [ autocompleteResponse, executeAutocomplete ]
};