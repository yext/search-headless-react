import '../sass/ScreenReader.scss';

interface Props {
  instructionsId?: string,
  instructions?: string,
  shouldCount: boolean,
  countKey?: number,
  countText?: string
}

export default function ScreenReader({
  instructionsId,
  instructions,
  shouldCount,
  countKey,
  countText,
}: Props): JSX.Element | null {

  return (
    <>
      {instructionsId &&
        <div
          id={instructionsId}
          className='ScreenReader__instructions'
        >
          {instructions}
        </div>
      }
      {shouldCount &&
        <div
          className='ScreenReader__count'
          key={countKey}
          aria-live='assertive'
        >
          {countText}
        </div>
      }
    </>
  );
};
