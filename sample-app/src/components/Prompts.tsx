
import { Children, cloneElement, isValidElement, useState } from 'react';
import ProgressBar from "../components/ProgressBar";
import { useAnswersActions } from '@yext/answers-headless-react';
import { Option } from './promptcards/StandardPrompt';
import StandardPrompt from './promptcards/StandardPrompt';
import { executeSearch } from '../utils/search-operations';
import { useHistory } from 'react-router';

interface Props {
  constructQueryFn: (options: Option[][]) => string,
  verticalKey?: string
}

export default function Prompts(props: React.PropsWithChildren<Props>): JSX.Element | null {
  const { children, constructQueryFn, verticalKey } = props;
  const childrenArray = Children.toArray(children);
  const [ currentPromptIndex, updatePromptIndex ] = useState(0);
  const [ promptSelectedOptions, updatePromptSelectedOptions ] 
    = useState<Option[][]>(Array(childrenArray.length).fill([]));
  const answersActions = useAnswersActions();
  const history = useHistory();

  const onClickPrevious = () => {
    updatePromptIndex(currentPromptIndex-1);
  }
  const onClickNext = () => {
    updatePromptIndex(currentPromptIndex+1);
  }
  const onClickSubmit = () => {
    executeSearch(answersActions, !!verticalKey);
    verticalKey
      ? history.push(`/${verticalKey}`)
      : history.push('/');
  }

  const child = childrenArray[currentPromptIndex];
  let prompt = child;
  if (isValidElement(child) && child.type === StandardPrompt) {
    const modifiedOnClickOption = (options: Option[]) => {
      child.props.onSelectedOptionUpdate?.(options);
      promptSelectedOptions[currentPromptIndex] = options;
      updatePromptSelectedOptions(promptSelectedOptions);
      answersActions.setQuery(constructQueryFn(promptSelectedOptions));
    }
    prompt = cloneElement(child, {
      preSelectedOptions: promptSelectedOptions[currentPromptIndex],
      onSelectedOptionUpdate: modifiedOnClickOption
    });
  }

  return (
    <div>
      <ProgressBar 
        completePercentage={currentPromptIndex/(childrenArray.length-1) * 100}
      />
      {prompt}
      {currentPromptIndex !== 0 &&
        <button onClick={onClickPrevious}>Previous</button>
      }
      {currentPromptIndex !== childrenArray.length-1 &&
        <button onClick={onClickNext}>Next</button>
      }
      {currentPromptIndex === childrenArray.length-1 &&
        <button onClick={onClickSubmit}>Submit</button>
      }
    </div>
  );
}
