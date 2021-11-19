import { AnswersActions } from "@yext/answers-headless-react";
import { SearchIntent } from "@yext/answers-headless";


const defaultGeolocationOptions: PositionOptions = {
  enableHighAccuracy: false,
  timeout: 6000,
  maximumAge: 300000,
};

/**
 * Provide utility functions related to vertical and universal search execution.
 * This includes any potential data check or setup related to a query before
 * performing a search, such as fetching searchIntents using autocomplete requests,
 * and retrieving user's location using nagivator.geolocation API.
 */
export default class SearchHandler {
  static async executeSearch(answersActions: AnswersActions, isVertical: boolean) {
    isVertical
      ? answersActions.executeVerticalQuery()
      : answersActions.executeUniversalQuery();
    return;
  }

  static async executeSearchWithIntents(
    answersActions: AnswersActions,
    isVertical: boolean,
    intents: SearchIntent[],
    geolocationOptions?: PositionOptions
  ) {
    if (intents.includes(SearchIntent.NearMe)) {
      try {
        const position = await SearchHandler.getUserLocation(geolocationOptions);
        answersActions.setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      } catch(e) {
        console.error(e);
      }
    }
    SearchHandler.executeSearch(answersActions, isVertical);
  }

  static async getSearchIntents(answersActions: AnswersActions, isVertical: boolean) {
    const results = isVertical
      ? await answersActions.executeVerticalAutocomplete()
      : await answersActions.executeUniversalAutocomplete();
    return results?.inputIntents;
  }

  static async getUserLocation(geolocationOptions?: PositionOptions): Promise<GeolocationPosition> {
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
}