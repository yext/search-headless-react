import classNames from 'classnames';

export interface Option {
  value: string
  render: () => JSX.Element | null;
}

interface Props {
  options: Option[]
  onClickOption?: (option: Option) => void,
  focusedOptionIndex: number | undefined;
  cssClasses: {
    optionContainer: string,
    option: string
    focusedOption: string
  }
}

/**
 * Renders dropdown options
 */
export default function Dropdown({
  options,
  onClickOption = () => {},
  focusedOptionIndex,
  cssClasses
}: Props): JSX.Element | null {
  function renderOption(option: Option, index: number) {
    const className = classNames(cssClasses.option, {
      [cssClasses.focusedOption]: index === focusedOptionIndex
    })
    return (
      <div key={option.value} className={className} onClick={() => onClickOption(option)}>
        {option.render()}
      </div>)
  }

  if (options.length < 1) {
    return null;
  }

  return (
    <div className={cssClasses.optionContainer}>
      {options.map(renderOption)}
    </div>
  );
};