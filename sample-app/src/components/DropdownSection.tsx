import classNames from "classnames";
import { useState, useEffect } from "react";

export interface Option {
  value: string,
  display: JSX.Element
}

interface DropdownSectionProps<T> {
  focusStatus?: string,
  options: T[],
  optionIdPrefix: string,
  onFocusChange: (value: string, focusedOptionId: string) => void,
  onLeaveSectionFocus?: (focusNext: boolean) => void,
  onClickOption: (option: T, optionIndex: number) => void,
  label?: string,
  cssClasses: {
    sectionContainer: string,
    sectionLabel: string,
    optionsContainer: string,
    option: string,
    focusedOption: string
  }
}

export default function DropdownSection<T extends Option>({
  focusStatus,
  options,
  optionIdPrefix,
  onFocusChange,
  onLeaveSectionFocus = () => {},
  onClickOption,
  label = '',
  cssClasses
}: DropdownSectionProps<T>): JSX.Element | null {

  const [focusedOptionIndex, setFocusedOptionIndex] = useState<number>(0);

  function changeOptionFocus(focusNext: boolean) {
    let newIndex = focusNext ? focusedOptionIndex + 1 : focusedOptionIndex - 1;

    if (newIndex > -1 && newIndex < options.length) {
      onFocusChange(options[newIndex].value, `${optionIdPrefix}-${newIndex}`);
    } else {
      focusNext ? onLeaveSectionFocus(true) : onLeaveSectionFocus(false);
      newIndex = newIndex === -1 ? 0 : options.length - 1;
    }

    setFocusedOptionIndex(newIndex);
  }

  function handleKeyDown(evt: globalThis.KeyboardEvent) {
    if (focusStatus === 'active') {
      if (['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft'].includes(evt.key)) {
        evt.preventDefault();
      }

      if (evt.key === 'ArrowDown' || evt.key === 'ArrowRight') {
        changeOptionFocus(true);
      } else if (evt.key === 'ArrowUp' || evt.key === 'ArrowLeft') {
        changeOptionFocus(false);
      }
    }
  }

  useEffect(() => {
    if (focusStatus === 'active') {
      onFocusChange(options[focusedOptionIndex].value, `${optionIdPrefix}-${focusedOptionIndex}`);
    } else if (focusStatus === 'reset') {
      setFocusedOptionIndex(0);
    }
  }, [focusStatus]);

  useEffect(() => {
    if (focusStatus === 'active') {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  });

  function renderOption(option: T, index: number) {
    const className = classNames(cssClasses.option, {
      [cssClasses.focusedOption]: focusStatus === 'active' && index === focusedOptionIndex
    })
    return (
      <div
        key={index}
        className={className}
        id={`${optionIdPrefix}-${index}`}
        onClick={() => onClickOption(option, index)}>
        {option.display}
      </div>
    );
  }

  return (
    <div className={cssClasses.sectionContainer}>
      {label &&
        <div className={cssClasses.sectionLabel}>
          {label}
        </div>
      }
      <div className={cssClasses.optionsContainer}>
        {options.map((option, index) => renderOption(option, index))}
      </div>
    </div>
  );
};
