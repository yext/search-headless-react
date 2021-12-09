import VisualSearchBar from './VisualSearchBar';
import { Result } from '@yext/answers-headless-react';
import EntityPreviews from './EntityPreviews';
import { universalResultsConfig } from '../../universalResultsConfig';

/**
 * This is an example of how to use the VisualSearchBar component.
 */
export default function SampleVisualSearchBar() {
  return (
    <VisualSearchBar
      placeholder='Search...'
      screenReaderInstructionsId='SearchBar__srInstructions'
      headlessId='visual-autocomplete'
      entityPreviewsDebouncingTime={150}
      verticalKeyToLabel={verticalKey => universalResultsConfig[verticalKey]?.label ?? verticalKey}
      renderEntityPreviews={isLoading => (
        <div className={isLoading ? 'opacity-50' : ''}>
          <EntityPreviews verticalKey='people'>
            {results => (
              <div className='flex'>
                {results.map(r => <PeopleCard result={r} key={r.name} />)}
              </div>
            )}
          </EntityPreviews>
          <EntityPreviews verticalKey='faq' limit={2}>
            {results => (
              <div className='flex flex-col'>
                {results.map(r => <FaqCard result={r} key={r.name} />)}
              </div>
            )}
          </EntityPreviews>
        </div>
      )}
    />
  )
}

interface CardProps {
  result: Result
}

interface FaqData {
  question?: string,
  answer?: string
}

function FaqCard({ result }: CardProps) {
  const faqData: FaqData = result.rawData;
  return (
    <div tabIndex={0} className='flex flex-col m-4'>
      <div>{faqData.question}</div>
      <div>{faqData.answer}</div>
    </div>
  )
}

interface PeopleData {
  headshot?: {
    url: string
  }
}

function PeopleCard({ result }: CardProps) {
  const peopleData: PeopleData = result.rawData;
  const headshotUrl = peopleData.headshot?.url;
  return (
    <div tabIndex={0} className='flex flex-col m-4'>
      <a href={result.link}>{result.name}</a>
      {headshotUrl && <img src={headshotUrl} alt={result.name} width={100} height={100} />}
    </div>
  )
}
