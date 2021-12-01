import { useRef, useState } from "react";

/**
 * Handles the network request race condition by synchronizing requests with their responses. If multiple
 * requests are sent before getting a response, only the response corresponding to the latest request will
 * be returned.
 * 
 * @param executeRequest Function that executes the network request
 * @returns Reponse to the latest request and a function to execute the request in a synchronized manner
 */
export function useSynchronizedRequest<RequestDataType, ResponseType>(
  executeRequest: (data?: RequestDataType) => Promise<ResponseType | undefined>
): [
    ResponseType | undefined,
    (data?: RequestDataType) => Promise<ResponseType | undefined>
  ]
{
  const networkIds = useRef({ latestRequest: 0, responseInState: 0 });
  const [synchronizedResponse, setSynchronizedResponse] = useState<ResponseType>();
  async function executeSynchronizedRequest (data?: RequestDataType): Promise<ResponseType | undefined> {
    const requestId = ++networkIds.current.latestRequest;
    return new Promise(async (resolve) => {
      const response = await executeRequest(data);
      if (requestId >= networkIds.current.responseInState) {
        setSynchronizedResponse(response);
        networkIds.current.responseInState = requestId;
      }
      resolve(response);
    });
  }
  return [synchronizedResponse, executeSynchronizedRequest]
};