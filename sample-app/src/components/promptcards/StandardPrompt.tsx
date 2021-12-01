import { useState } from "react";
import '../../sass/Prompt.scss';
import classNames from "classnames";

export interface Option {
  value: string
}

export interface StandardPromptProps {
  question: string,
  options?: Option[],
  onlyOneSelected: boolean,
  preSelectedOptions?: Option[],
  onSelectedOptionUpdate?: (options: Option[]) => void
}

export default function StandardPrompt(props: StandardPromptProps): JSX.Element | null {
  const { question, options, onSelectedOptionUpdate=() => {}, onlyOneSelected, preSelectedOptions=[] } = props;
  const [selectedOptions, updateSelectedOptions] = useState<Option[]>(preSelectedOptions);
  if (!options) {
    return null;
  }
  
  const onOptionClick = (option: Option) => {
    let newSelectedOptions;
    if (selectedOptions.includes(option)) { //unselect
      newSelectedOptions = selectedOptions.filter(selectedOption => selectedOption !== option);
      updateSelectedOptions(newSelectedOptions);
    } else { //select
      if (onlyOneSelected) {
        newSelectedOptions = [option];
        updateSelectedOptions(newSelectedOptions);
      } else {
        newSelectedOptions = [...selectedOptions, option];
        updateSelectedOptions(newSelectedOptions);
      }
    }
    onSelectedOptionUpdate(newSelectedOptions);
  }
  return (
    <div className='StandardPrompt'>
      <div>{question}</div>
      <div>
        {options.map((option, index) => {
          const cssClasses = classNames('Prompt__option', { 'Prompt__optionHighlight': selectedOptions.includes(option) });
          return <div className={cssClasses} key={index} onClick={() => {onOptionClick(option)}}>{option.value}</div>
        })}
      </div>
    </div>
  );
}
