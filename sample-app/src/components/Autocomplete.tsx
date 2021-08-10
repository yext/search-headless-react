import { AutocompleteResult } from '@yext/answers-core';
import { useAnswersActions, useAnswersState } from '@yext/answers-headless-react';
import { useEffect, useState, useRef, KeyboardEvent } from 'react';
import classNames from 'classnames';
import renderWithHighlighting from './utils/renderWithHighlighting';
import '../sass/Autocomplete.scss';

interface Props {
  query: string
  renderInputAndDropdown: (input: JSX.Element, dropdown: JSX.Element | null) => JSX.Element
  onSelectedIndexChange?: (query: string) => void
  onTextChange?: (query: string) => void
  onSubmit?: (query: string) => void
  inputClassName?: string
  placeholder?: string
}

export default function Autocomplete({
  query,
  inputClassName,
  onSelectedIndexChange = () => {},
  onTextChange = () => {},
  onSubmit = () => {},
  renderInputAndDropdown,
  placeholder
}: Props) {
  const answersActions = useAnswersActions();
  const globalQueryState = useAnswersState(state => state.query?.query) || '';
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [shouldDisplay, setShouldDisplay] = useState<boolean>(false);
  const [autocompleteResults, setAutocompleteResults] = useState<AutocompleteResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(document.createElement('input')); 
  
  function handleDocumentClick(evt: MouseEvent) {
    const target = evt.target as HTMLElement;
    if (!target || !target.isSameNode(inputRef.current)) {
      setSelectedIndex(-1);
      setShouldDisplay(false);
    } else {
      setShouldDisplay(true);
    }
  }
  useEffect(() => {
    document.addEventListener('click', handleDocumentClick)
    return () => document.removeEventListener('click', handleDocumentClick);
  });

  function updateAutocompleteResults() {
    answersActions.executeVerticalAutoComplete(query).then(autocompleteResponse => {
      if (!autocompleteResponse) {
        return;
      }
      setAutocompleteResults(autocompleteResponse.results)
    });
  }

  function handleKeyDown(evt: KeyboardEvent<HTMLInputElement>) {
    if (['ArrowDown', 'ArrowUp'].includes(evt.key)) {
      evt.preventDefault();
    }

    if (evt.key === 'Enter') {
      onSubmit(query);
      setShouldDisplay(false);
      setSelectedIndex(-1);
    } else if (evt.key === 'Escape') {
      setSelectedIndex(-1);
      setShouldDisplay(false);
    } else if (evt.key === 'ArrowDown' && selectedIndex < autocompleteResults.length - 1) {
      const newSelectedIndex = selectedIndex + 1;
      const newQuery = autocompleteResults[newSelectedIndex]?.value;
      onSelectedIndexChange(newQuery);
      setSelectedIndex(newSelectedIndex);
      setShouldDisplay(true);
    } else if (evt.key === 'ArrowUp' && selectedIndex >= 0) {
      const newSelectedIndex = selectedIndex - 1;
      // Go back to the global query state if the new selectedIndex is -1
      const newQuery = newSelectedIndex < 0
        ? globalQueryState
        : autocompleteResults[newSelectedIndex]?.value
        onSelectedIndexChange(newQuery);
      setSelectedIndex(newSelectedIndex);
      setShouldDisplay(true);
    }
  }

  const inputJSX = (
    <input
      className={inputClassName}
      placeholder={placeholder}
      onChange={evt => {
        setShouldDisplay(true);
        setSelectedIndex(-1);
        const query = evt.target.value;
        onTextChange(query);
        updateAutocompleteResults();
      }}
      onClick={updateAutocompleteResults}
      onKeyDown={handleKeyDown}
      value={query}
      ref={inputRef}
    />
  );

  function renderAutocomplete({ value, matchedSubstrings }: AutocompleteResult, index: number) {
    const className = classNames('Autocomplete__option', {
      'Autocomplete__option--selected': index === selectedIndex
    });
    return (
      <div key={value} className={className} onClick={() => {
        setSelectedIndex(index);
        onSubmit && onSubmit(autocompleteResults[index].value);
        setShouldDisplay(false);
      }}>
        {renderWithHighlighting({ value, matchedSubstrings })}
      </div>
    )
  }

  const shouldRenderDropdown = shouldDisplay && autocompleteResults && autocompleteResults.length !== 0;
  const dropdownJSX = shouldRenderDropdown ? (
    <div className='Autocomplete'>
      {autocompleteResults.map(renderAutocomplete)}
    </div>
  ) : null;

  return renderInputAndDropdown(inputJSX, dropdownJSX);
}
