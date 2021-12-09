import { useEffect, useRef } from "react";

export default function useComponentMountStatus() {
  const isMountedRef = useRef<boolean>(false);
  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; }
  }, []);
  
  return isMountedRef;
}