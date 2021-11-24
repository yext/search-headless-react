import { useAnswersActions, useAnswersState, LocationBiasMethod } from '@yext/answers-headless-react';
import { executeSearch, getUserLocation  } from '../utils/search-operations';

interface Props {
  isVertical: boolean,
  geolocationOptions?: PositionOptions,
  cssClasses?: {
    container: string,
    location: string,
    source: string,
    button: string
  }
}


const defaultCSSClasses = {
  container: 'LocationBias',
  location: 'LocationBias__location',
  source: 'LocationBias__source',
  button: 'LocationBias__button',
};

export default function LocationBias(props: Props) {
  const answersActions = useAnswersActions();
  const { isVertical, geolocationOptions, cssClasses: customCssClasses } = props;
  const locationBias = useAnswersState(s => s.location.locationBias)
  const cssClasses = Object.assign(defaultCSSClasses, customCssClasses);

  if (!locationBias?.displayName) return null;

  const attributionMessage = 
      locationBias?.method === LocationBiasMethod.Ip ? '(based on your internet address)'
        : locationBias?.method === LocationBiasMethod.Device ? '(based on your device)'
          : '';

  async function handleGeolocationClick() {
    try {
      const position = await getUserLocation(geolocationOptions);
      answersActions.setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    } catch (e) {
      console.error(e);
    }
    executeSearch(answersActions, isVertical);
  }

  return (
    <div className={cssClasses.container}>
      <span className={cssClasses.location}>
        {locationBias.displayName}
      </span>
      {attributionMessage !== '' && (
        <span className={cssClasses.source}>
          {attributionMessage}
        </span>
      )}
      <button 
        className={cssClasses.button}
        onClick={handleGeolocationClick}
      >
        Update your location
      </button>
    </div>
  )
}