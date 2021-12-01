import { Children, PropsWithChildren, isValidElement, Fragment } from 'react';
import { VerticalResults } from '@yext/answers-headless-react';
import { VisualAutocompleteSection, VisualAutocompleteSectionProps } from './VisualAutocompleteSection';

/**
 * VisualAutocompleteEntities is a wrapper around props.children, that adds special behavior to any
 * VisualAutocompleteSection children found.
 */
export default function VisualAutocompleteEntities({ children, verticalResultsArray }: PropsWithChildren<{
  verticalResultsArray: VerticalResults[]
}>) {
  const verticalKeyToResults = verticalResultsArray.reduce<Record<string, VerticalResults>>((prev, current) => {
    prev[current.verticalKey] = current;
    return prev;
  }, {});

  const childrenArray = Children.toArray(children).map(child => {
    if (!isValidElement(child) || child.type !== VisualAutocompleteSection) {
      return child;
    }
    const { verticalKey, children } = child.props as VisualAutocompleteSectionProps;
    const verticalResults = verticalKeyToResults[verticalKey];
    if (!verticalResults) {
      return null;
    }
    return children(verticalResults.results);
  });

  return <>{childrenArray.map((child, i) => <Fragment key={i}>{child}</Fragment>)}</>;
}
