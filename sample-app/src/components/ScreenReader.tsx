import { useRef } from "react";
import { processTranslation } from './utils/processTranslation';
import '../sass/ScreenReader.scss';

interface Props {
  instructionsId?: string,
  instructions?: string,
  hasCount: boolean,
  hasInput?: boolean,
  optionsLength?: number,
  shouldDisplayOptions?: boolean,
  countKey?: number,
  cssClasses: {
    screenReaderInstructions?: string,
    screenReaderCount?: string
  }
}

export default function ScreenReader({
  instructionsId,
  instructions,
  hasCount,
  hasInput,
  optionsLength,
  shouldDisplayOptions,
  countKey,
  cssClasses
} : Props): JSX.Element | null {

  const countRef = useRef<HTMLDivElement>(document.createElement('div'));
  const prevAutocompleteCountText = countRef.current.innerText;

  if (!shouldDisplayOptions || !(hasInput || optionsLength || prevAutocompleteCountText)) {
    removeAutocompleteCountText();
  }
  
  function removeAutocompleteCountText() {
    if (hasCount) {
      if (countRef.current.innerText !== '') {
        countRef.current.innerText = '';
      }
    }
  }

  return (
    <>
      {instructionsId &&
        <div
          id={instructionsId}
          className={cssClasses.screenReaderInstructions}
        >
          {instructions}
        </div>
      }
      {hasCount &&
        <div
          className={cssClasses.screenReaderCount}
          key={countKey}
          aria-live='assertive'
          ref={countRef}
        >
          {processTranslation({
            phrase: `${optionsLength} autocomplete option found.`,
            pluralForm: `${optionsLength} autocomplete options found.`,
            count: optionsLength
          })}
        </div>
      }
    </>
  );
};