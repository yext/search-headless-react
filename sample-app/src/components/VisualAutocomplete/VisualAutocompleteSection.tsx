import { Result } from '@yext/answers-headless-react';

export interface VisualAutocompleteSectionProps {
  verticalKey: string,
  children: (results: Result[]) => JSX.Element,
  limit?: number
}

/**
 * VisualAutocompleteSection is a dummy component who's responsibility is decorating its children with
 * VisualAutocomplete behavior. The results that correspond to the given verticalKey are
 * exposed as a FACC (function as a child component).
 */
export function VisualAutocompleteSection(_: VisualAutocompleteSectionProps) {
  return null;
}