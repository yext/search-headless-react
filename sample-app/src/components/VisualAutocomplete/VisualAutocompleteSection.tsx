import { Result } from '@yext/answers-headless-react';

export interface VisualAutocompleteSectionProps {
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
export function VisualAutocompleteSection(_: VisualAutocompleteSectionProps) {
  return null;
}