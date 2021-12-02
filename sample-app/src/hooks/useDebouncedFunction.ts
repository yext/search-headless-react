import { useRef } from 'react';

type Func = (...args: any[]) => any;
type DebouncedFunction<F extends Func> = (...args: Parameters<F>) => Promise<undefined | ReturnType<F>>;

export default function useDebouncedFunction<F extends Func>(func: F, milliseconds: number): DebouncedFunction<F> {
  const timeoutIdRef = useRef<number | undefined>();
  const debounced: DebouncedFunction<F> = (...args: Parameters<F>) => {
    return new Promise(resolve => {
      if (timeoutIdRef.current !== undefined) {
        clearTimeout(timeoutIdRef.current);
      }
      timeoutIdRef.current = window.setTimeout(() => {
        resolve(func(...args));
        timeoutIdRef.current = undefined;
      }, milliseconds)
    })
  }
  return debounced;
}