import { SearchIntent } from "@yext/answers-headless";
import { useLayoutEffect } from "react";
import { useAnswersActions } from "@yext/answers-headless-react";
import { executeSearch, getSearchIntents, updateLocationIfNeeded } from "../utils/search-operations";

/**
 * Sets up the state for a page
 * @param verticalKey - The verticalKey associated with the page, or undefined for universal pages
 */
export default function usePageSetupEffect(verticalKey?: string) {
  const answersActions = useAnswersActions();
  useLayoutEffect(() => {
    const stateToClear = {
      filters: {},
      universal: {},
      vertical: {}
    }
    answersActions.setState({
      ...answersActions.state,
      ...stateToClear
    });
    verticalKey
      ? answersActions.setVerticalKey(verticalKey)
      : answersActions.setVerticalKey('');
    const executeQuery = async () => {
      let searchIntents: SearchIntent[] = [];
      if (!answersActions.state.location.userLocation) {
        searchIntents = await getSearchIntents(answersActions, !!verticalKey) || [];
        await updateLocationIfNeeded(answersActions, searchIntents);
      }
      executeSearch(answersActions, !!verticalKey);
    };
    executeQuery();
  }, [answersActions, verticalKey]);
}