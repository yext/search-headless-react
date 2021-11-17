import { AnswersActions } from "@yext/answers-headless-react";
import { SearchIntent } from "@yext/answers-headless";

const defaultGeolocationOptions: PositionOptions = {
  enableHighAccuracy: false,
  timeout: 6000,
  maximumAge: 300000,
};

/**
 * Executes universal or vertical search with user location retrieved from nagivator.geolocation API.
 * If useLocationOnNearMeOnly is true, will attempt to get user location only if the query's searchIntents
 * (retrieved through autocomplete response) contains 'NEAR_ME'. If there's a failure in getting
 * user location, a normal search is performed.
 */
export async function executeSearchWithUserLocation(
  answersActions: AnswersActions,
  isVertical: boolean,
  geolocationOptions?: PositionOptions,
  useLocationOnNearMeOnly?: boolean
) {
  const executeSearch = () => {
    isVertical
      ? answersActions.executeVerticalQuery()
      : answersActions.executeUniversalQuery();
    return;
  }

  if (useLocationOnNearMeOnly) {
    const results = isVertical
      ? await answersActions.executeVerticalAutocomplete()
      : await answersActions.executeUniversalAutocomplete();
    if (!results?.inputIntents?.includes(SearchIntent.NearMe)) {
      executeSearch();
      return;
    }
  }

  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
      answersActions.setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      })
    },
    (err) => {
      console.error(err);
      console.error('unable to determine user location.');
    },
    Object.assign(defaultGeolocationOptions, geolocationOptions)
    );
  } else {
    console.warn('unable to determine user location.');
  }
  executeSearch();
}
