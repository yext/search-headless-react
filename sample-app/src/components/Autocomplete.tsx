import { AutocompleteResult } from '@yext/answers-core';
import { MutableRefObject, useEffect, useState } from 'react';
import '../sass/Autocomplete.scss';

interface Props {
  autocompleteResults: AutocompleteResult[]
  inputRef: MutableRefObject<HTMLInputElement>
  onOptionClick?: (selectedOptionValue: string) => void
  onSelect?: (selectedOptionValue: string) => void
}

export default function Autocomplete({ autocompleteResults, inputRef, onSelect, onOptionClick }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [shouldDisplay, setShouldDisplay] = useState<boolean>(true);
  useEffect(() => {
    const currentRef = inputRef?.current
    if (!currentRef) {
      return;
    }
    function handleKeyDown(evt: KeyboardEvent) {
      if (['ArrowDown', 'ArrowUp'].includes(evt.key)) {
        evt.preventDefault();
      }

      if (evt.key === 'Enter') {
        setShouldDisplay(false);
        setSelectedIndex(-1);
      } else if (evt.key === 'Escape') {
        setSelectedIndex(-1);
        setShouldDisplay(false);
      } else if (evt.key === 'ArrowDown' && selectedIndex < autocompleteResults.length - 1) {
        onSelect && onSelect(autocompleteResults[selectedIndex + 1]?.value || '');
        setSelectedIndex(selectedIndex + 1);
        setShouldDisplay(true);
      } else if (evt.key === 'ArrowUp' && selectedIndex >= 0) {
        onSelect && onSelect(autocompleteResults[selectedIndex - 1]?.value || '');
        setSelectedIndex(selectedIndex - 1);
        setShouldDisplay(true);
      }
    }
    function toggleDisplayOn() {
      setShouldDisplay(true);
    }
    function handleDocumentClick(evt: MouseEvent) {
      const target = evt.target as HTMLElement;
      if (!target || !target.isSameNode(inputRef.current)) {
        setSelectedIndex(-1);
        setShouldDisplay(false);
      } else {
        setShouldDisplay(true);
      }
    }
    currentRef.addEventListener('keydown', handleKeyDown);
    currentRef.addEventListener('change', toggleDisplayOn);
    document.addEventListener('click', handleDocumentClick);
    currentRef.addEventListener('focus', toggleDisplayOn);
    return () => {
      currentRef.removeEventListener('keydown', handleKeyDown);
      currentRef.removeEventListener('keydown', toggleDisplayOn);
      document.removeEventListener('click', handleDocumentClick);
      currentRef.removeEventListener('focus', toggleDisplayOn);
    };
  });

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
          <div key={result.value} className={className} onClick={() => {
            setSelectedIndex(index);
            onOptionClick && onOptionClick(autocompleteResults[index].value);
            setShouldDisplay(false);
          }}>
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
