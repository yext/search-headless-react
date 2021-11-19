import classNames from 'classnames';

export interface Option {
  value: string,
  render: () => JSX.Element | null
}

interface Props {
  options: Option[],
  onClickOption?: (option: Option) => void,
  focusedOptionIndex: number | undefined,
  optionIdPrefix: string,
  cssClasses: {
    dropdownContainer?: string,
    option?: string,
    focusedOption?: string
  }
}

/**
 * Renders dropdown options
 */
export default function Dropdown({
  options,
  onClickOption = () => {},
  focusedOptionIndex,
  optionIdPrefix,
  cssClasses
}: Props): JSX.Element | null {
  function renderOption(option: Option, index: number) {
    const className = classNames(cssClasses.option, {
      [cssClasses.focusedOption ?? '']: index === focusedOptionIndex
    })
    return (
      <div 
        key={index}
        className={className}
        id={`${optionIdPrefix}-${index}`}
        onClick={() => onClickOption(option)}>
        {option.render()}
      </div>)
  }

  if (options.length < 1) {
    return null;
  }

  return (
    <div className={cssClasses.dropdownContainer}>
      {options.map((option, index) => renderOption(option, index))}
    </div>
  );
};