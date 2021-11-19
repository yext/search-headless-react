import { AnswersActions } from "@yext/answers-headless-react";
import { SearchIntent } from "@yext/answers-headless";

const defaultGeolocationOptions: PositionOptions = {
  enableHighAccuracy: false,
  timeout: 6000,
  maximumAge: 300000,
};

/**
 * If the provided search intents include a 'NEAR_ME' intent, retrieve and
 * store user's location in headless state. Then, execute a search with
 * user's location, if that's successfully retrieved, attached to the request.
 */
export async function executeSearchWithIntents(
  answersActions: AnswersActions,
  isVertical: boolean,
  intents: SearchIntent[],
  geolocationOptions?: PositionOptions
) {
  if (intents.includes(SearchIntent.NearMe)) {
    try {
      const position = await getUserLocation(geolocationOptions);
      answersActions.setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    } catch(e) {
      console.error(e);
    }
  }
  executeSearch(answersActions, isVertical);
}

/**
 * Executes a universal/vertical search
 */
export async function executeSearch(answersActions: AnswersActions, isVertical: boolean) {
  isVertical
    ? answersActions.executeVerticalQuery()
    : answersActions.executeUniversalQuery();
  return;
}

/**
 * Get search intents of the current query stored in headless using autocomplete request.
 */
export async function getSearchIntents(answersActions: AnswersActions, isVertical: boolean) {
  const results = isVertical
    ? await answersActions.executeVerticalAutocomplete()
    : await answersActions.executeUniversalAutocomplete();
  return results?.inputIntents;
}

/**
 * Retrieves user's location using nagivator.geolocation API
 */
export async function getUserLocation(geolocationOptions?: PositionOptions): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => resolve(position),
        err => { 
          console.error('Error occured using geolocation API. Unable to determine user\'s location.');
          reject(err); 
        },
        Object.assign(defaultGeolocationOptions, geolocationOptions)
      );
    } else {
      reject('No access to geolocation API. Unable to determine user\'s location.');
    }
  });
}
