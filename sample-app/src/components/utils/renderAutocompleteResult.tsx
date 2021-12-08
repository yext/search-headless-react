import { AutocompleteResult } from '@yext/answers-headless-react';
import { ReactComponent as MagnifyingGlassIcon } from '../../icons/magnifying_glass.svg';
import renderHighlightedValue from '../utils/renderHighlightedValue';
import { Link } from "react-router-dom";
import classNames from 'classnames';
import { VerticalLink } from '../DropdownSection';

export interface AutocompleteResultCssClasses {
  linkContainer?: string,
  option?: string,
  link?: string,
  focusedOption?: string,
  focusedLink?: string,
  icon?: string
}

export const builtInCssClasses = {
  linkContainer: 'flex flex-col ml-14',
  option: 'flex',
  link: 'text-gray-600',
  focusedOption: 'bg-gray-100',
  focusedLink: 'bg-gray-100',
  icon: 'w-8 mx-2'
}

/**
 * Renders an autocomplete result including the icon to the left, and the related vertical links
 * @param result The result to render
 * @returns JSX.Element
 */
export default function renderAutocompleteResult(
  result: AutocompleteResult,
  onClick: () => void,
  cssClasses: AutocompleteResultCssClasses,
  isOptionFocus?: boolean,
  verticalLinks?: VerticalLink[],
  focusLinkIndex?: number
) {
  const hasFocusLink = focusLinkIndex !== undefined && focusLinkIndex !== -1;
  const OptionCssClasses = cssClasses.focusedOption
    ? classNames(cssClasses.option, {
      [cssClasses.focusedOption]: isOptionFocus && !hasFocusLink
    })
    : cssClasses.option;

  const focusLinkCssClasses = cssClasses.focusedLink
    ? classNames(cssClasses.link, {
      [cssClasses.focusedLink]: isOptionFocus && hasFocusLink
    })
    : cssClasses.link;

  return (
    <>
      <div className={OptionCssClasses} onClick={onClick}>
        <div className={cssClasses.icon}><MagnifyingGlassIcon /></div>
        <div>{renderHighlightedValue(result)}</div>
      </div>
      {verticalLinks && verticalLinks.length > 0 &&
        <div className={cssClasses.linkContainer}>
          {verticalLinks.map(({ label, verticalKey }, index) => {
            return <Link 
              key={index}
              className={index === focusLinkIndex ? focusLinkCssClasses : cssClasses.link}
              onClick={onClick}
              to={`/${verticalKey}`}
            >
              in {label}
            </Link>
          })}
        </div>}
    </>
  )
}
