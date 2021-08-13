import { useAnswersActions, useAnswersState } from '@yext/answers-headless-react';
import Autocomplete from './Autocomplete';
import { ReactComponent as MagnifyingGlassIcon } from '../icons/magnifying_glass.svg';
import '../sass/SearchBar.scss';

interface Props {
  placeholder?: string
  initialQuery?: string
  isVertical: boolean
}

/**
 * Renders a SearchBar that is hooked up with an Autocomplete component
 */
export default function SearchBar({ placeholder, isVertical }: Props) {
  const answersActions = useAnswersActions();
  const query = useAnswersState(state => state.query.query);

  function renderInputAndDropdown(input: JSX.Element, dropdown: JSX.Element | null) {
    return (
      <>
        <div className='SearchBar__inputContainer'>
          {input}
          <button
            className='SearchBar__submitButton'
            onClick={() => {
              answersActions.executeVerticalQuery();
            }}
          >
            <MagnifyingGlassIcon/>
          </button>
        </div>
        {dropdown}
      </>
    )
  }

  return (
    <div className='SearchBar'>
      <Autocomplete
        renderInputAndDropdown={renderInputAndDropdown}
        inputClassName='SearchBar__input'
        placeholder={placeholder}
        query={query}
        isVertical={isVertical}
        onTextChange={query => {
          answersActions.setQuery(query);
        }}
        onSubmit={query => {
          answersActions.setQuery(query);
          answersActions.executeVerticalQuery();
        }}
        onSelectedIndexChange={query => {
          answersActions.setQuery(query);
        }}
      />
    </div>
  )
}