import { Result } from '@yext/answers-headless-react';

export interface VisualEntitiesProps {
  verticalKey: string,
  children: (results: Result[]) => JSX.Element,
  limit?: number
}

/**
 * VisualAutocompleteSection is responsible for providing configuration to VisualAutocompleteEntities,
 * and allowing users to specify arbitrary VisualAutocomplete layouts.
 * 
 * This is done by providing results through props.children, using an FACC (function as a child component).
 */
export function VisualEntities(_: VisualEntitiesProps) {
  return null;
}