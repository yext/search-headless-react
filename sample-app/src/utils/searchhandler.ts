import { AnswersActions } from "../../../lib";


const defaultGeolocationOptions: PositionOptions = {
  enableHighAccuracy: false,
  timeout: 6000,
  maximumAge: 300000,
};

export default class SearchHandler {
  static async executeSearch(answersActions: AnswersActions, isVertical: boolean) {
    isVertical
      ? answersActions.executeVerticalQuery()
      : answersActions.executeUniversalQuery();
    return;
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
            console.log(err);
            console.error('Unable to determine user\'s location.');
            reject(); 
          },
          Object.assign(defaultGeolocationOptions, geolocationOptions)
        );
      } else {
        console.error('Unable to determine user\'s location.');
        reject();
      }
    });
  }
}