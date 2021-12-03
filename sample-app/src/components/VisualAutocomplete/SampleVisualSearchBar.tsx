import VisualSearchBar from './VisualSearchBar';
import { Result } from '@yext/answers-headless-react';
import Accordion from 'react-bootstrap/Accordion';
import '../../sass/SampleAutocompleteSection.scss';
import VisualEntities from './VisualEntities';

/**
 * This is an example of how to use the VisualSearchBar component.
 */
export default function SampleVisualSearchBar() {
  return (
    <VisualSearchBar
      placeholder='Search...'
      screenReaderInstructionsId='SearchBar__srInstructions'
      headlessId='visual-autocomplete'
      debounceTime={150}
      renderVisualEntities={(isLoading) => (
        <div style={{ opacity: isLoading ? 0.5 : 1 }}>
          <VisualEntities verticalKey='people'>
            {results => (
              <div className='people-section'>
                {results.map(r => <PeopleCard result={r} key={r.name} />)}
              </div>
            )}
          </VisualEntities>
          <VisualEntities verticalKey='faq' limit={2}>
            {results => (
              <div className='faq-section'>
                {results.map(r => <FaqCard result={r} key={r.name} />)}
              </div>
            )}
          </VisualEntities>
        </div>
      )}
    >
      {(autocompleteDropdown, visualEntities) => (
        <>
          {autocompleteDropdown}
          {visualEntities}
        </>
      )}
    </VisualSearchBar>
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
    <Accordion tabIndex={0}>
      <Accordion.Header>{faqData.question}</Accordion.Header>
      <Accordion.Body>{faqData.answer}</Accordion.Body>
    </Accordion>
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
    <div tabIndex={0} className='people-card'>
      <a href={result.link}>{result.name}</a>
      {headshotUrl && <img src={headshotUrl} alt={result.name} width={100} height={100} />}
    </div>
  )
}
