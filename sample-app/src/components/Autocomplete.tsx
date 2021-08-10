import { AutocompleteResult } from '@yext/answers-core';
import { MutableRefObject, useEffect, useState } from 'react';
import classNames from 'classnames';
import renderWithHighlighting from './utils/renderWithHighlighting';
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

  useEffect(() => {
    const currentRef = inputRef?.current
    if (!currentRef) {
      return;
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

  function renderAutocomplete({ value, matchedSubstrings }: AutocompleteResult, index: number) {
    const className = classNames('Autocomplete__option', {
      'Autocomplete__option--selected': index === selectedIndex
    });
    return (
      <div key={value} className={className} onClick={() => {
        setSelectedIndex(index);
        onOptionClick && onOptionClick(autocompleteResults[index].value);
        setShouldDisplay(false);
      }}>
        {renderWithHighlighting({ value, matchedSubstrings })}
      </div>
    )
  }

  return (
    <div className='Autocomplete'>
      {autocompleteResults.map(renderAutocomplete)}
    </div>
  )
}
