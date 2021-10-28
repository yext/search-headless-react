import '../sass/ScreenReader.scss';

interface Props {
  instructionsId?: string,
  instructions?: string,
  shouldCount: boolean,
  countKey?: number,
  optionsLength?: number,
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
  countKey,
  optionsLength = 0,
  generateCountText = () => '',
  cssClasses
} : Props): JSX.Element | null {

  const countText = countKey ? generateCountText(optionsLength) : '';

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
        >
          {countText}
        </div>
      }
    </>
  );
};
