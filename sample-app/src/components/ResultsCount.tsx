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
  cssClasses?: ResultsCountCssClasses
}


export default function ResultsCount({ customCssClasses, cssCompositionMethod }: Props) {
  const resultsCount = useAnswersState(state => state.vertical?.resultsCount) || 0;
  const resultsLength = useAnswersState(state => state.vertical?.results?.length) || 0;
  const offset = useAnswersState(state => state.vertical?.offset) || 0;
  const cssClasses = useComposedCssClasses(builtInCssClasses, customCssClasses, cssCompositionMethod);
  return <ResultsCountDisplay resultsCount={resultsCount} resultsLength={resultsLength} offset={offset} cssClasses={cssClasses}/>;
}

export function ResultsCountDisplay({
  resultsCount=0,
  resultsLength=0,
  offset=0, 
  cssClasses={} 
}: ResultsCountConfig): JSX.Element | null {
  if (resultsLength === 0) {
    return null;
  }

  const messageArray = [
    'Showing',
    offset + 1,
    'to',
    offset + resultsLength,
    'of',
    resultsCount,
    'Results'
  ];

  const spanArray = messageArray.map((value, index) => {
    const isLastString = index === messageArray.length - 1;
    const isNumber = typeof value === 'number';
    
    const classes = cssClasses.number
      ? classNames(cssClasses.text, { [cssClasses.number]: isNumber })
      : cssClasses.text ?? '';

    const spanValue = isLastString ? value : `${value} `;

    return <span key={`${index}-${value}`} className={classes}>{spanValue}</span>
  });
  
  return <div className={cssClasses.container}>{spanArray}</div>
}