import { ReactChild, ReactChildren } from 'react';
import { provideAnswersHeadless, AnswersHeadless } from '@yext/answers-headless';
import { AnswersConfig } from '@yext/answers-core';
import { AnswersActionsContext } from './AnswersActionsContext';

interface Props extends AnswersConfig {
  children?: ReactChildren | ReactChild | (ReactChildren | ReactChild)[],
  verticalKey?: string
}

export function AnswersActionsProvider(props: Props): JSX.Element {
  const { children, verticalKey, ...answersConfig } = props;
  const answers: AnswersHeadless = provideAnswersHeadless(answersConfig);
  verticalKey && answers.setVerticalKey(verticalKey);
  return (
    <AnswersActionsContext.Provider value={answers}>
      {children}
    </AnswersActionsContext.Provider>
  );
}
