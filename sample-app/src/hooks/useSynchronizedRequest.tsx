import { useRef, useState } from "react";

export function useSynchronizedRequest<T>(
  executeRequest: (inputValue?: string) => Promise<T | undefined>
): [
    T | undefined,
    (inputValue?: string) => Promise<T | undefined>
  ]
{
  const networkIds = useRef({ latestRequest: 0, responseInState: 0 });
  const [synchronizedResponse, setSynchronizedResponse] = useState<T>();
  async function executeSynchronizedRequest (inputValue?: string): Promise<T | undefined> {
    const requestId = ++networkIds.current.latestRequest;
    return new Promise(async (resolve) => {
      const response = await executeRequest(inputValue);
      if (requestId >= networkIds.current.responseInState) {
        setSynchronizedResponse(response);
        networkIds.current.responseInState = requestId;
      }
      resolve(response);
    });
  }
  return [synchronizedResponse, executeSynchronizedRequest]
};