import { processTranslation } from './utils/processTranslation';
import { ReactComponent as Chevron } from '../icons/chevron.svg';
import { useAnswersState } from '@yext/answers-headless-react';
import '../sass/AlternativeVerticals.scss';

interface Props {
  currentVerticalLabel: string,
  isShowingResults: boolean,
  verticalSuggestions: {
    url: string,
    label: string
  }[],
  universalUrl: string
}

export default function AlternativeVerticals (props: Props) {
  const { currentVerticalLabel, isShowingResults, verticalSuggestions, universalUrl } = props;
  const numSuggestions = verticalSuggestions.length;
  const query = useAnswersState(state => state.query.latest);

  return  (
    <div className='AlternativeVerticals'>
      <div className='AlternativeVerticals__noResultsInfo'>
        <em className='AlternativeVerticals__noResultsInfo--emphasized'>No results found</em><span> in {currentVerticalLabel}. </span>
        {isShowingResults && <>
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
                count: numSuggestions
              })}
            </span>
            <span className='AlternativeVerticals__detailsQuery'>{query}</span>
          </div>
          <ul>
            {verticalSuggestions.map(suggestion => {
              return (
                <li className="AlternativeVerticals__suggestion">
                  <a className='AlternativeVerticals__suggestionLink' href={suggestion.url}>
                    <div className='AlternativeVerticals__verticalIconWrapper'></div>
                    <span className='AlternativeVerticals__suggestionVerticalLabel'></span>
                    <span className='AlternativeVerticals__suggestionNumResults'></span>
                    <div className='AlternativeVerticals__chevronIconWrapper'><Chevron/></div>
                  </a>
                </li>
              );
            })}
          </ul>
          {universalUrl && 
            <div className='AlternativeVerticals__universalDetails'>
              <span>Alternatively you can </span>
              <a href={universalUrl}>view results across all search categories</a>
            </div>
          }
        </div>
      }
    </div>
  );
}