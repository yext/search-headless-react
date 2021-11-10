import { useAnswersActions, useAnswersState, LocationBiasMethod } from '@yext/answers-headless-react';

interface Props {
  isVertical: boolean,
  geolocationOptions?: {
    enableHighAccuracy?: boolean,
    timeout?: number,
    maximumAge?: number
  },
  cssClasses?: {
    container: string,
    location: string,
    source: string,
    button: string
  }
}

const defaultGeolocationOptions = {
  enableHighAccuracy: false,
  timeout: 6000,
  maximumAge: 300000,
};

const defaultCSSClasses = {
  container: 'LocationBias',
  location: 'LocationBias__location',
  source: 'LocationBias__source',
  button: 'LocationBias__button',
};

export default function LocationBias(props: Props) {
  const answersActions = useAnswersActions();
  const locationBias = useAnswersState(s => s.location.locationBias)
  const geolocationOptions = Object.assign(defaultGeolocationOptions, props.geolocationOptions);
  const cssClasses = Object.assign(defaultCSSClasses, props.cssClasses);

  if (!locationBias?.displayName) return null;

  const attributionMessage = 
      locationBias?.method === LocationBiasMethod.Ip ? '(based on your internet address)'
        : locationBias?.method === LocationBiasMethod.Device ? '(based on your device)'
          : '';

  function handleGeolocationClick() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        answersActions.setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
        props.isVertical
          ? answersActions.executeVerticalQuery()
          : answersActions.executeUniversalQuery()
      },
      (err) => console.error(err),
      geolocationOptions);
    }
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
      <button className={cssClasses.button} onClick={handleGeolocationClick}>
        Update your location
      </button>
    </div>
  )
}