import { useAnswersState } from '@yext/answers-headless-react';
import classNames from 'classnames';
import { CompositionMethod, useComposedCssClasses } from '../hooks/useComposedCssClasses';

interface ResultsCountCssClasses {
  container?: string,
  text?: string,
  number?: string
}

const builtInCssClasses: ResultsCountCssClasses = {
  container: 'pb-4',
  text: 'text-sm text-gray-700',
  number: 'font-medium'
}

interface Props {
  customCssClasses?: ResultsCountCssClasses,
  cssCompositionMethod?: CompositionMethod
}

export interface ResultsCountConfig {
  resultsCount?: number,
  resultsLength?: number,
  offset?: number,
  customCssClasses?: ResultsCountCssClasses,
  cssCompositionMethod?: CompositionMethod
}


export default function ResultsCount(props: Props) {
  const resultsCount = useAnswersState(state => state.vertical?.resultsCount) || 0;
  const resultsLength = useAnswersState(state => state.vertical?.results?.length) || 0;
  const offset = useAnswersState(state => state.vertical?.offset) || 0;
  
  return <ResultsCountDisplay resultsCount={resultsCount} resultsLength={resultsLength} offset={offset} {...props}/>;
}

export function ResultsCountDisplay({
  resultsCount=0,
  resultsLength=0,
  offset=0, 
  customCssClasses,
  cssCompositionMethod
}: ResultsCountConfig): JSX.Element | null {
  const cssClasses = useComposedCssClasses(builtInCssClasses, customCssClasses, cssCompositionMethod);
  if (resultsLength === 0) {
    return null;
  }

  const messageArray = [
    'Showing ',
    offset + 1,
    ' to ',
    offset + resultsLength,
    ' of ',
    resultsCount,
    ' Results'
  ];

  const spanArray = messageArray.map((value, index) => {
    const isNumber = typeof value === 'number';
    
    const classes = cssClasses.number
      ? classNames(cssClasses.text, { [cssClasses.number]: isNumber })
      : cssClasses.text ?? '';

    return <span key={`${index}-${value}`} className={classes}>{value}</span>
  });
  
  return <div className={cssClasses.container}>{spanArray}</div>
}