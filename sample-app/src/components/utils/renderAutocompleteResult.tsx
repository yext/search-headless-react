import { AutocompleteResult } from '@yext/answers-headless-react';
import { ReactComponent as MagnifyingGlassIcon } from '../../icons/magnifying_glass.svg';
import renderHighlightedValue from '../utils/renderHighlightedValue';

/**
 * Renders an autocomplete result including the icon to the left
 * @param result The result to render
 * @returns JSX.Element
 */
export default function renderAutocompleteResult(result: AutocompleteResult, className?: string) {
  return <>
    <div className={className}>
      <MagnifyingGlassIcon />
    </div>
    <div>
      {renderHighlightedValue(result)}
    </div>
  </>
}
