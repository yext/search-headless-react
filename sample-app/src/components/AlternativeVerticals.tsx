import { processTranslation } from './utils/processTranslation';
import { ReactComponent as Chevron } from '../icons/chevron.svg';
import { ReactComponent as Star } from '../icons/star.svg';
import { useAnswersState, useAnswersActions, VerticalResults } from '@yext/answers-headless-react';
import '../sass/AlternativeVerticals.scss';

interface VerticalConfig {
  label: string,
  verticalKey: string
}

interface VerticalSuggestion extends VerticalConfig {
  resultsCount: number
}

function isVerticalSuggestion (suggestion: VerticalSuggestion | null): suggestion is VerticalSuggestion {
  return suggestion?.resultsCount !== undefined;
}

interface Props {
  currentVerticalLabel: string,
  verticalsConfig: VerticalConfig[],
  displayAllResults?: boolean
}

export default function AlternativeVerticals (props: Props): JSX.Element | null {
  const { currentVerticalLabel, verticalsConfig, displayAllResults = true } = props;

  const alternativeVerticals = useAnswersState(state => state.vertical.noResults?.alternativeVerticals) || [];
  const allResultsForVertical = useAnswersState(state => state.vertical.noResults?.allResultsForVertical.results) || [];
  const query = useAnswersState(state => state.query.mostRecentSearch);
  const actions = useAnswersActions();

  const verticalSuggestions = buildVerticalSuggestions(verticalsConfig, alternativeVerticals);
  const isShowingAllResults = displayAllResults && allResultsForVertical.length > 0;

  function buildVerticalSuggestions(
    verticalsConfig: VerticalConfig[],
    alternativeVerticals: VerticalResults[]) : VerticalSuggestion[] {
    
    return alternativeVerticals
      .map((alternativeResults: VerticalResults) => {
        const matchingVerticalConfig = verticalsConfig.find(config => {
          return config.verticalKey === alternativeResults.verticalKey;
        });

        return matchingVerticalConfig
          ? {
            ...matchingVerticalConfig,
            resultsCount: alternativeResults.resultsCount
          }
          : null;
      })
      .filter(isVerticalSuggestion)
      .filter(verticalSuggestion => verticalSuggestion.resultsCount > 0);
  }

  if (verticalSuggestions.length <= 0) {
    return null;
  }

  return  (
    <div className='AlternativeVerticals'>
      {renderNoResultsInfo()}
      {verticalSuggestions &&
        <div className='AlternativeVerticals__suggestionsWrapper'>
          <div className='AlternativeVerticals__details'>
            <span>
              {processTranslation({
                phrase: 'The following search category yielded results for ',
                pluralForm: 'The following search categories yielded results for ',
                count: verticalSuggestions.length
              })}
            </span>
            <span className='AlternativeVerticals__detailsQuery'>"{query}":</span>
          </div>
          <ul className='AlternativeVerticals__suggestionList'>
            {verticalSuggestions.map(renderSuggestion)}
          </ul>
          {renderUniversalDetails()}
        </div>
      }
    </div>
  );

  function renderNoResultsInfo() {
    return (
      <div className='AlternativeVerticals__noResultsInfo'>
        <em className='AlternativeVerticals__noResultsInfo--emphasized'>No results found</em><span> in {currentVerticalLabel}. </span>
        {isShowingAllResults && <>
          <span>Showing </span>
          <em className="AlternativeVerticals__noResultsInfo--emphasized">all {currentVerticalLabel}</em>
          <span> instead.</span>
        </>}
      </div>
    );
  }

  function renderSuggestion(suggestion: VerticalSuggestion) {
    return (
      <li key={suggestion.verticalKey} className="AlternativeVerticals__suggestion">
        <button className='AlternativeVerticals__suggestionLink AlternativeVerticals__button'
          onClick={() => {
            actions.setVerticalKey(suggestion.verticalKey);
            actions.executeVerticalQuery();
          }}>
          <div className='AlternativeVerticals__verticalIconWrapper'><Star/></div>
          <span className='AlternativeVerticals__suggestionVerticalLabel'>{suggestion.label}</span>
          <span className='AlternativeVerticals__suggestionNumResults'>({suggestion.resultsCount} results)</span>
          <div className='AlternativeVerticals__chevronIconWrapper'><Chevron/></div>
        </button>
      </li>
    );
  }

  function renderUniversalDetails() {
    return (
      <div className='AlternativeVerticals__universalDetails'>
        <span>Alternatively you can </span>
        <button className='AlternativeVerticals__button AlternativeVerticals__universalDetailsButton' 
          onClick={actions.executeUniversalQuery}>
          <span>view results across all search categories</span>
        </button>
      </div>
    );
  }
}