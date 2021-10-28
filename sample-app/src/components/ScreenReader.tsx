import { useRef } from "react";
import '../sass/ScreenReader.scss';

interface Props {
  instructionsId?: string,
  instructions?: string,
  shouldCount: boolean,
  shouldDisplayOptions?: boolean,
  hasInput?: boolean,
  optionsLength?: number,
  countKey?: number,
  generateCountText?: (numOptions: number) => string,
  cssClasses: {
    screenReaderInstructions?: string,
    screenReaderCount?: string
  }
}

export default function ScreenReader({
  instructionsId,
  instructions,
  shouldCount,
  shouldDisplayOptions,
  hasInput,
  optionsLength = 0,
  countKey,
  generateCountText = () => '',
  cssClasses
} : Props): JSX.Element | null {

  const countRef = useRef<HTMLDivElement>(document.createElement('div'));
  const prevAutocompleteCountText = countRef.current.innerText;

  if (!shouldDisplayOptions || !(hasInput || optionsLength || prevAutocompleteCountText)) {
    removeAutocompleteCountText();
  }
  
  function removeAutocompleteCountText() {
    if (shouldCount && countRef.current.innerText !== '') {
      countRef.current.innerText = '';
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
      {shouldCount &&
        <div
          className={cssClasses.screenReaderCount}
          key={countKey}
          aria-live='assertive'
          ref={countRef}
        >
          {generateCountText(optionsLength)}
        </div>
      }
    </>
  );
};
