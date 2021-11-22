import classNames from "classnames";
import { Option } from "./Dropdown";

interface DropdownSectionProps<T> {
  options: T[],
  optionIdPrefix: string,
  focusedOptionIndex: number | undefined,
  onClickOption: (option: T, optionIndex: number) => void,
  label?: string,
  cssClasses: {
    optionContainer: string,
    optionSection: string,
    sectionLabel: string,
    option: string,
    focusedOption: string
  }
}

// interface SimpleDropdownSectionProps<T> extends DropdownSectionProps<T> {
  
// }

export default function DropdownSection({
  options,
  optionIdPrefix,
  focusedOptionIndex,
  onClickOption,
  label = '',
  cssClasses
}: DropdownSectionProps<Option>): JSX.Element | null {

  function renderOption(option: Option, index: number) {
    const className = classNames(cssClasses.option, {
      [cssClasses.focusedOption]: index === focusedOptionIndex
    })
    return (
      <div 
        key={index}
        className={className}
        id={`${optionIdPrefix}-${index}`}
        onClick={() => onClickOption(option, index)}>
        {option.render()}
      </div>)
  }

  if (options.length < 1) {
    return null;
  }

  return (
    <div className={cssClasses.optionSection}>
      {label &&
        <div className={cssClasses.sectionLabel}>
          {label}
        </div>
      }
      <div className={cssClasses.optionContainer}>
        {options.map((option, index) => renderOption(option, index))}
      </div>
    </div>
  );
};



