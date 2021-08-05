import { AutocompleteResult } from '@yext/answers-core';
import { useAnswersActions } from '@yext/answers-headless-react';
import { MutableRefObject, useEffect, useState } from 'react';
import '../sass/Autocomplete.scss';

interface Props {
  autocompleteResults: AutocompleteResult[]
  inputRef: MutableRefObject<HTMLInputElement>
}

export default function Autocomplete({ autocompleteResults, inputRef }: Props) {
  const [selectedIndex, updateSelected] = useState<number>(-1);
  const [shouldDisplay, toggleDisplay] = useState<boolean>(true);
  const answersActions = useAnswersActions();
  useEffect(() => {
    const currentRef = inputRef?.current
    if (!currentRef) {
      return;
    }
    function handleKeyDown(evt: KeyboardEvent) {
      if (evt.key === 'Escape') {
        toggleDisplay(false);
      } else if (evt.key === 'ArrowDown') {
        updateSelected(selectedIndex + 1);
      } else if (evt.key === 'ArrowUp' && selectedIndex >= 0) {
        updateSelected(selectedIndex - 1);
      }
    }
    function toggleOn() {
      toggleDisplay(true);
    }
    function handleDocumentClick(evt: MouseEvent) {
      if (!evt.target) {
        toggleDisplay(false);
        updateSelected(-1);
      }
      const target = evt.target as HTMLElement;
      if (target.isSameNode(inputRef.current)) {
        toggleDisplay(true);
      } else {
        toggleDisplay(false);
        updateSelected(-1);
      }
    }
    currentRef.addEventListener('keydown', handleKeyDown);
    currentRef.addEventListener('change', toggleOn);
    document.addEventListener('click', handleDocumentClick);
    currentRef.addEventListener('focus', toggleOn);
    return () => {
      currentRef.removeEventListener('keydown', handleKeyDown);
      currentRef.removeEventListener('keydown', toggleOn);
      document.removeEventListener('click', handleDocumentClick);
      currentRef.removeEventListener('focus', toggleOn);
    };
  });

  function submitOption(index: number) {
    if (!inputRef?.current) {
      return;
    }
    inputRef.current.value = autocompleteResults[index].value;
    answersActions.setQuery(inputRef?.current.value || '');
    answersActions.executeVerticalQuery();
  }

  if (!shouldDisplay || !autocompleteResults || autocompleteResults.length === 0) {
    return null;
  }
  return (
    <div className='Autocomplete'>
      {autocompleteResults.map((result, index) => {
        const className = index === selectedIndex
          ? 'Autocomplete-option Autocomplete-option--selected'
          : 'Autocomplete-option'
        return (
          <div key={result.value} className={className} onClick={() => submitOption(index)}>
            {renderWithHighlighting(result)}
          </div>
        )}
      )}
    </div>
  )
}

const renderWithHighlighting = ({ value, matchedSubstrings }: AutocompleteResult) => {
  if (!matchedSubstrings || matchedSubstrings.length === 0) {
    return <span>{value}</span>;
  }
  const substrings = [...matchedSubstrings];
  substrings.sort((a, b) => a.offset - b.offset);
  const highlightedJSX = []
  let curr = 0;
  for (let { offset, length } of substrings) {
    if (offset > curr) {
      highlightedJSX.push(<span key={curr}>{value.substring(curr, offset)}</span>)
    }
    highlightedJSX.push(<strong key={offset}>{value.substring(offset, offset + length)}</strong>)
    curr = offset + length;
  }
  if (curr < value.length) {
    highlightedJSX.push(<span key={curr}>{value.substring(curr)}</span>)
  }
  return highlightedJSX;
}
