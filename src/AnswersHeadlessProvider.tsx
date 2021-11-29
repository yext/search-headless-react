import { ReactChild, ReactChildren } from 'react';
import { provideAnswersHeadless, AnswersHeadless, AnswersConfig } from '@yext/answers-headless-react';
import { AnswersHeadlessContext } from './AnswersHeadlessContext';

interface Props extends AnswersConfig {
  children?: ReactChildren | ReactChild | (ReactChildren | ReactChild)[],
  verticalKey?: string
}

export function AnswersHeadlessProvider(props: Props): JSX.Element {
  const { children, verticalKey, ...answersConfig } = props;
  const answers: AnswersHeadless = provideAnswersHeadless(answersConfig);
  verticalKey && answers.setVerticalKey(verticalKey);
  return (
    <AnswersHeadlessContext.Provider value={answers}>
      {children}
    </AnswersHeadlessContext.Provider>
  );
}
