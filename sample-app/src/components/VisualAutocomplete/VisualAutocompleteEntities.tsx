import { Children, PropsWithChildren, isValidElement, Fragment } from 'react';
import { VerticalResults } from '@yext/answers-headless-react';
import { VisualAutocompleteSection, VisualAutocompleteSectionProps } from './VisualEntities';
import { useVisualEntities } from '../../hooks/useVisualEntities';

type Props = PropsWithChildren<{
  verticalResultsArray: VerticalResults[]
}>

/**
 * VisualEntities provides vertical results to its children through a FACC.
 * 
 * The results given correspond to the child's verticalKey prop.
 */
export default function VisualEntities({
  children,
  verticalResultsArray
}: Props) {

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

  return (
    <>
      {childrenArray.map((child, i) => <Fragment key={i}>{child}</Fragment>)}
    </>
  )
}
