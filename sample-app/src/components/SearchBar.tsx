import { useState, Fragment } from 'react';
import { useAnswersActions } from '@yext/answers-headless-react';
import Autocomplete from './Autocomplete';
import { ReactComponent as MagnifyingGlassIcon } from '../icons/magnifying_glass.svg';
import '../sass/SearchBar.scss';

interface Props {
  placeholder?: string
  initialQuery?: string
}

/**
 * Renders a SearchBar that is hooked up with an Autocomplete component
 */
export default function SearchBar({
  placeholder,
  initialQuery = ''
}: Props) {
  const answersActions = useAnswersActions();
  const [displayQuery, setDisplayQuery] = useState<string>(initialQuery);

  function renderInputAndDropdown(input: JSX.Element, dropdown: JSX.Element | null) {
    return (
      <Fragment>
        <div className='SearchBar__inputContainer'>
          {input}
          <button
            className='SearchBar__submitButton'
            onClick={() => {
              answersActions.setQuery(displayQuery);
              answersActions.executeVerticalQuery();
            }}
          >
            <MagnifyingGlassIcon/>
          </button>
        </div>
        {dropdown}
      </Fragment>
    )
  }

  return (
    <div className='SearchBar'>
      <Autocomplete
        renderInputAndDropdown={renderInputAndDropdown}
        inputClassName='SearchBar__input'
        placeholder={placeholder}
        query={displayQuery}
        onTextChange={query => {
          setDisplayQuery(query)
          answersActions.setQuery(query);
        }}
        onSubmit={query => {
          setDisplayQuery(query);
          answersActions.setQuery(query);
          answersActions.executeVerticalQuery();
        }}
        onSelectedIndexChange={query => {
          setDisplayQuery(query)
        }}
      />
    </div>
  )
}
