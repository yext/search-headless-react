import '../sass/ScreenReader.scss';

interface Props {
  instructionsId?: string,
  instructions?: string,
  shouldCount: boolean,
  announcementKey?: number,
  announcementText?: string
}

export default function ScreenReader({
  instructionsId,
  instructions,
  shouldCount,
  announcementKey,
  announcementText,
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
          className='ScreenReader__announcementText'
          key={announcementKey}
          aria-live='assertive'
        >
          {announcementText}
        </div>
      }
    </>
  );
};
