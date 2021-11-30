import { useRef, useState } from "react";

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