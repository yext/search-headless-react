import { processTranslation } from './utils/processTranslation';
import { ReactComponent as Chevron } from '../icons/chevron.svg';
import { useAnswersState, useAnswersActions } from '@yext/answers-headless-react';
import { VerticalResults } from '@yext/answers-core';
import '../sass/AlternativeVerticals.scss';

interface VerticalConfig {
  label: string,
  verticalKey: string
}

interface VerticalSuggestion extends VerticalConfig {
  resultsCount: number;
}

interface Props {
  currentVerticalLabel: string,
  verticalsConfig: VerticalConfig[],
  displayAllResults?: boolean;
}

export default function AlternativeVerticals (props: Props): JSX.Element | null {
  const { currentVerticalLabel, verticalsConfig, displayAllResults = true } = props;

  const alternativeVerticals = useAnswersState(state => state.vertical.alternativeVerticals) || [];
  const allResultsForVertical = useAnswersState(state => state.vertical.results?.allResultsForVertical?.verticalResults.results) || [];
  const query = useAnswersState(state => state.query.latest);
  const actions = useAnswersActions();

  const verticalSuggestions = buildVerticalSuggestions(verticalsConfig, alternativeVerticals);
  const isShowingAllResults = displayAllResults && allResultsForVertical.length > 0;

  function buildVerticalSuggestions(
    verticalsConfig: VerticalConfig[],
    alternativeVerticals: VerticalResults[])
  : VerticalSuggestion[] {
    return alternativeVerticals.reduce((verticalSuggestions: VerticalSuggestion[], alternativeVerticalResults: VerticalResults) => {
      const matchingVerticalConfig = verticalsConfig.find(config => {
        return config.verticalKey === alternativeVerticalResults.verticalKey;
      });
      if (!matchingVerticalConfig || alternativeVerticalResults.resultsCount < 1) {
        return verticalSuggestions;
      }
      verticalSuggestions.push({
        ...matchingVerticalConfig,
        resultsCount: alternativeVerticalResults.resultsCount
      });
      return verticalSuggestions;
    }, []);
  }

  if (verticalSuggestions.length <= 0) {
    return null;
  }

  return  (
    <div className='AlternativeVerticals'>
      <div className='AlternativeVerticals__noResultsInfo'>
        <em className='AlternativeVerticals__noResultsInfo--emphasized'>No results found</em><span> in {currentVerticalLabel}. </span>
        {isShowingAllResults && <>
          <span>Showing </span>
          <em className="AlternativeVerticals__noResultsInfo--emphasized">all {currentVerticalLabel}</em>
          <span> instead.</span>
        </>}
      </div>
      {verticalSuggestions &&
        <div className='AlternativeVerticals__suggestionsWrapper'>
          <div className='AlternativeVerticals__details'>
            <span>{processTranslation({
                phrase: 'The following search category yielded results for ',
                pluralForm: 'The following search categories yielded results for ',
                count: verticalSuggestions.length
              })}
            </span>
            <span className='AlternativeVerticals__detailsQuery'>"{query}":</span>
          </div>
          <ul>
            {verticalSuggestions.map(suggestion => {
              return (
                <li className="AlternativeVerticals__suggestion">
                  <button className='AlternativeVerticals__suggestionLink AlternativeVerticals__button'
                    onClick={() => {
                      // TODO: Clear vertical results so that they disappear right after clicking the link
                      actions.setAlternativeVerticals([]);
                      actions.setVerticalKey(suggestion.verticalKey);
                      actions.executeVerticalQuery();
                    }}>
                    <div className='AlternativeVerticals__verticalIconWrapper'></div>
                    <span className='AlternativeVerticals__suggestionVerticalLabel'>{suggestion.label}</span>
                    <span className='AlternativeVerticals__suggestionNumResults'> ({suggestion.resultsCount} results)</span>
                    <div className='AlternativeVerticals__chevronIconWrapper'><Chevron/></div>
                  </button>
                </li>
              );
            })}
          </ul>
            <div className='AlternativeVerticals__universalDetails'>
              <span>Alternatively you can </span>
              <button className='AlternativeVerticals__button' onClick={() => { actions.executeUniversalQuery(); }}>view results across all search categories</button>
            </div>
        </div>
      }
    </div>
  );
}