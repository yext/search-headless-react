import { AutocompleteResult } from '@yext/answers-core';
import { useAnswersActions, StateMapper, useAnswersState } from '@yext/answers-headless-react';
import { useEffect, useRef, KeyboardEvent, useReducer } from 'react';
import classNames from 'classnames';
import renderWithHighlighting from './utils/renderWithHighlighting';
import '../sass/Autocomplete.scss';

interface Props {
  query?: string
  renderInputAndDropdown: (input: JSX.Element, dropdown: JSX.Element | null) => JSX.Element
  onSelectedIndexChange?: (query: string) => void
  onTextChange?: (query: string) => void
  onSubmit?: (query: string) => void
  inputClassName?: string
  placeholder?: string
  isVertical: boolean
}

interface State {
  selectedIndex: number
  shouldDisplay: boolean
  lastAutocompleteQuery: string
}

type Action = 
  | { type: 'Show' }
  | { type: 'Hide' }
  | { type: 'InputClick' }
  | { type: 'InputChange' }
  | { type: 'ArrowKey', newIndex: number }

function reducer(state: State, action: Action): State {
  switch(action.type) {
    case 'Show': 
      return { ...state, shouldDisplay: true }
    case 'Hide': 
      return { ...state, selectedIndex: -1, shouldDisplay: false }
    case 'InputChange': 
      return { ...state, selectedIndex: -1, shouldDisplay: true }
    case 'InputClick': 
      return { ...state, shouldDisplay: true }
    case 'ArrowKey': 
      return {
        ...state,
        selectedIndex: action.newIndex,
        shouldDisplay: true
      }
  }
}

export default function Autocomplete({
  query = '',
  inputClassName,
  isVertical,
  onSelectedIndexChange = () => {},
  onTextChange = () => {},
  onSubmit = () => {},
  renderInputAndDropdown,
  placeholder
}: Props) {
  const mapStateToAutocompleteResults: StateMapper<AutocompleteResult[] | undefined> = isVertical
    ? state => state.vertical.autoComplete?.results
    : state => state.universal.autoComplete?.results;
  const autocompleteResults = useAnswersState(mapStateToAutocompleteResults) || [];
  const answersActions = useAnswersActions();
  const [{
    selectedIndex,
    shouldDisplay,
    lastAutocompleteQuery
  }, dispatch] = useReducer(reducer, {
    selectedIndex: -1,
    shouldDisplay: false,
    lastAutocompleteQuery: ''
  });

  const inputRef = useRef<HTMLInputElement>(document.createElement('input')); 
  
  function handleDocumentClick(evt: MouseEvent) {
    const target = evt.target as HTMLElement;
    if (!target || !target.isSameNode(inputRef.current)) {
      dispatch({ type: 'Hide' });
    } else {
      dispatch({ type: 'Show' });
    }
  }
  useEffect(() => {
    document.addEventListener('click', handleDocumentClick)
    return () => document.removeEventListener('click', handleDocumentClick);
  });

  function executeAutocompleteRequest(newQuery: string) {
    answersActions.setQuery(newQuery);
    isVertical
      ? answersActions.executeVerticalAutoComplete()
      : answersActions.executeUniversalAutoComplete()
  }

  function handleKeyDown(evt: KeyboardEvent<HTMLInputElement>) {
    if (['ArrowDown', 'ArrowUp'].includes(evt.key)) {
      evt.preventDefault();
    }

    if (evt.key === 'Enter') {
      onSubmit(query);
      dispatch({ type: 'Hide' });
    } else if (evt.key === 'Escape') {
      dispatch({ type: 'Hide' });
    } else if (evt.key === 'ArrowDown' && selectedIndex < autocompleteResults.length - 1) {
      const newIndex = selectedIndex + 1;
      dispatch({ type: 'ArrowKey', newIndex })
      const newQuery = autocompleteResults[newIndex]?.value;
      onSelectedIndexChange(newQuery);
    } else if (evt.key === 'ArrowUp' && selectedIndex >= 0) {
      const newIndex = selectedIndex - 1;
      dispatch({ type: 'ArrowKey', newIndex })
      const newQuery = newIndex < 0
        ? lastAutocompleteQuery
        : autocompleteResults[newIndex]?.value;
      onSelectedIndexChange(newQuery);
    }
  }

  const inputJSX = (
    <input
      className={inputClassName}
      placeholder={placeholder}
      onChange={evt => {
        dispatch({ type: 'InputChange' })
        const newQuery = evt.target.value;
        onTextChange(newQuery);
        executeAutocompleteRequest(newQuery);
      }}
      onClick={() => executeAutocompleteRequest(query)}
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
        onSubmit(autocompleteResults[index].value);
        dispatch({ type: 'Hide' })
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
