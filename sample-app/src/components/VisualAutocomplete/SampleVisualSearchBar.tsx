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
      entityPreviewsDebouncingTime={100}
      verticalKeyToLabel={verticalKey => universalResultsConfig[verticalKey]?.label ?? verticalKey}
      renderEntityPreviews={isLoading => (
        <div className={isLoading ? 'opacity-50' : ''}>
          <EntityPreviews verticalKey='events'>
            {results => (
              <div className='flex'>
                {results.map(r => <EventCard result={r} key={r.name} />)}
              </div>
            )}
          </EntityPreviews>
          <EntityPreviews verticalKey='faqs' limit={2}>
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
    <div tabIndex={0} className='flex flex-col m-4 rounded-md p-2'>
      <div className='text-lg font-medium pb-1'>{faqData.question}</div>
      <div>{faqData.answer}</div>
    </div>
  )
}

interface EventData {
  venueName?: string
}

function EventCard({ result }: CardProps) {
  const eventData: EventData = result.rawData;
  const venueName = eventData.venueName;
  return (
    <div tabIndex={0} className='flex flex-col m-4 border rounded-md p-3 text-lg'>
      <div className='font-medium pb-1'>{result.name}</div>
      <div className='text-base'>{venueName}</div>
    </div>
  )
}