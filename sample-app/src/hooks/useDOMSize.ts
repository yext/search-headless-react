import { RefObject, useLayoutEffect, useState } from 'react';
import useResizeObserver from '@react-hook/resize-observer'

export function useDOMSize<T extends HTMLElement>(target: RefObject<T>) {
  const [size, setSize] = useState<DOMRect>()

  useLayoutEffect(() => {
    if (!target.current) {
      return;
    }
    setSize(target.current.getBoundingClientRect())
  }, [ target ])

  useResizeObserver(target, entry => setSize(entry.contentRect));
  return size;
}