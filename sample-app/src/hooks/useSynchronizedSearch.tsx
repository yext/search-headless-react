import { useRef, useState } from "react";

export function useSynchronizedSearch<T>(
  executeSearch: (inputValue?: string) => Promise<T | undefined>
): [
    T | undefined,
    (inputValue?: string) => Promise<T | undefined>
  ]
{
  const searchNetworkIds = useRef({ latestRequest: 0, responseInState: 0 });
  const [synchronizedSearchResponse, setSynchronizedSearchResponse] = useState<T>();
  async function executeSynchronizedSearch (inputValue?: string): Promise<T | undefined> {
    const requestId = ++searchNetworkIds.current.latestRequest;
    return new Promise(async (resolve) => {
      const response = await executeSearch(inputValue);
      if (requestId >= searchNetworkIds.current.responseInState) {
        setSynchronizedSearchResponse(response);
        searchNetworkIds.current.responseInState = requestId;
      }
      resolve(response);
    });
  }
  return [synchronizedSearchResponse, executeSynchronizedSearch]
};