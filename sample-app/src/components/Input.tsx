import React, { KeyboardEvent, forwardRef } from 'react';

interface Props {
  inputValue?: string
  placeholder?: string
  onChange: (inputValue: string) => void
  onClick?: () => void
  onKeyDown: (evt: KeyboardEvent<HTMLInputElement>) => void
  renderButtons?: () => JSX.Element | null
  cssClasses: {
    inputElement: string,
    inputContainer: string
  }
}

/**
 * Renders an input element with optional buttons
 */
function Input ({
  inputValue,
  placeholder,
  onChange,
  onClick,
  onKeyDown,
  renderButtons = () => null,
  cssClasses
}: Props, ref: React.Ref<HTMLInputElement>) {
  return (
    <div className={cssClasses.inputContainer}>
      <input
        className={cssClasses.inputElement}
        placeholder={placeholder}
        onChange={evt => {
          const inputValue = evt.target.value;
          onChange(inputValue);
        }}
        onClick={onClick}
        onKeyDown={onKeyDown}
        value={inputValue}
        ref={ref}
      />
      {renderButtons()}
    </div>
  )
}

export default forwardRef<HTMLInputElement, Props>(Input);