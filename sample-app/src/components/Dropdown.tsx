import classNames from 'classnames';

export interface Option {
  value: string
  render: () => JSX.Element | null;
}

interface Props {
  options: Option[]
  onClickOption?: (option: Option) => void,
  focusedOptionIndex: number | undefined;
  theme: {
    optionContainer: string,
    option: string
    option__focused: string
  }
}

/**
 * Renders dropdown options
 */
export default function Dropdown({
  options,
  onClickOption = () => {},
  focusedOptionIndex,
  theme
}: Props): JSX.Element | null {
  function renderOption(option: Option, index: number) {
    const className = classNames(theme.option, {
      [theme.option__focused]: index === focusedOptionIndex
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
    <div className={theme.optionContainer}>
      {options.map(renderOption)}
    </div>
  );
};