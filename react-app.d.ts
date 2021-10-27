/**
 * Allows TypeScript to correctly recognize the .svg module declarations,
 * where svg can be used as a React component.
 */
declare module '*.svg' {
  import * as React from 'react';

  export const ReactComponent: React.FunctionComponent<React.SVGProps<
    SVGSVGElement
  > & { title?: string }>;

  const src: string;
  export default src;
}