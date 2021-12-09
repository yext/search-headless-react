import { AutocompleteResult } from '@yext/answers-headless-react';
import renderHighlightedValue from '../utils/renderHighlightedValue';

export interface AutocompleteResultCssClasses {
  option?: string,
  icon?: string
}

export const builtInCssClasses = {
  option: 'flex',
  icon: 'w-8 mx-2'
}

/**
 * Renders an autocomplete result, including an icon to the left if provided.
 * @param result The result to render
 * @returns JSX.Element
 */
export default function renderAutocompleteResult(
  result: AutocompleteResult,
  cssClasses?: AutocompleteResultCssClasses,
  Icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
) {
  cssClasses = cssClasses ?? {};
  return <>
    {Icon && <div className={cssClasses.icon}>
      <Icon />
    </div>}
    <div className={cssClasses.option}>
      {renderHighlightedValue(result)}
    </div>
  </>
}
