import classNames from 'classnames';

export interface Option {
  value: string,
  render: () => JSX.Element | null
}

interface Props {
  options: {
    results: Option[], 
    label?: string
  }[],
  onClickOption?: (option: Option, sectionIndex: number, optionIndex: number) => void,
  focusedSectionIndex: number | undefined,
  focusedOptionIndex: number | undefined,
  optionIdPrefix: string,
  cssClasses: {
    optionContainer: string,
    optionSection: string,
    sectionLabel: string,
    option: string,
    focusedOption: string
  }
}

/**
 * Renders dropdown options
 */
export default function Dropdown({
  options,
  onClickOption = () => {},
  focusedSectionIndex,
  focusedOptionIndex,
  optionIdPrefix,
  cssClasses
}: Props): JSX.Element | null {
  function renderSection(section: {results: Option[], label?: string}, sectionIndex: number) {
    return (
      <div
        className={cssClasses.optionSection}
        key={`section-${sectionIndex}`}>
        {section.label &&
          <div
            className={cssClasses.sectionLabel}
            key={section.label}>
            {section.label}
          </div>
        }
        {section.results.map((option, optionIndex) => renderOption(option, sectionIndex, optionIndex))}
      </div>
    )
  }

  function renderOption(option: Option, sectionIndex: number, optionIndex: number) {
    const className = classNames(cssClasses.option, {
      [cssClasses.focusedOption]: sectionIndex === focusedSectionIndex && optionIndex === focusedOptionIndex
    })
    return (
      <div 
        key={`${sectionIndex}-${optionIndex}`}
        className={className}
        id={`${optionIdPrefix}-${sectionIndex}-${optionIndex}`}
        onClick={() => onClickOption(option, sectionIndex, optionIndex)}>
        {option.render()}
      </div>
    )
  }

  if (options.length < 1) {
    return null;
  }

  return (
    <div className={cssClasses.optionContainer}>
      {options.map((section, sectionIndex) => renderSection(section, sectionIndex))}
    </div>
  );
};