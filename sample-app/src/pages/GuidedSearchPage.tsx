
import SearchBar from "../components/SearchBar";
import Prompts from "../components/Prompts";
import StandardPrompt from "../components/promptcards/StandardPrompt";
import { Option } from "../components/promptcards/StandardPrompt";
import { useHistory } from 'react-router';

export default function GuidedSearchPage(props: {
  verticalKey?: string
}) {
  const { verticalKey } = props; 
  const history = useHistory();
  return (
    <div className='GuidedSearchPage'>
      <SearchBar
        placeholder='Search...'
        isVertical={!!verticalKey}
        screenReaderInstructionsId='SearchBar__srInstructions'
        onExecuteSearch={() => {
          verticalKey
            ? history.push(`/${verticalKey}`)
            : history.push('/');
        }}
      />
      <Prompts
        verticalKey={verticalKey}
        constructQueryFn={(options: Option[][]) => {
          return options?.flatMap(aPromptOptions => {
            return aPromptOptions?.map(option => option.value).join(', ');
          }).filter(options => !!options).join(' and ');
        }}
      >
        <StandardPrompt 
          question='What country are they located in?'
          options={[{ value: 'Canada' }, { value: 'US' }, { value: 'Remote' }]}
          onlyOneSelected={true}
        />
        <StandardPrompt 
          question='What department(s) are they in?'
          options={[{ value: 'Technology' }, { value: 'Product' }, { value: 'Sale Operations' }]}
          onlyOneSelected={false}
        />
        <StandardPrompt 
          question='What language(s) do they speak?'
          options={[{ value: 'Japanese' }, { value: 'English' }, { value: 'Spanish' }]}
          onlyOneSelected={false}
        />
      </Prompts>
    </div>
  )
}