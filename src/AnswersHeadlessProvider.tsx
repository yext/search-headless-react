import { ReactChild, ReactChildren } from 'react';
import { provideStatefulCore } from '@yext/answers-headless';
import { AnswersConfig } from '@yext/answers-core';
import { AnswersHeadlessContext } from './AnswersHeadlessContext';

interface Props extends AnswersConfig {
  verticalKey?: string
  children?: ReactChildren | ReactChild | ReactChildren[] | ReactChild[]
}

export function AnswersHeadlessProvider(props: Props) {
  const { children, verticalKey, ...answerConfig } = props;
  const storeActions = provideStatefulCore(answerConfig)
  if (verticalKey) {
    storeActions.setVerticalKey(verticalKey);
  }
  return (
    <AnswersHeadlessContext.Provider value={storeActions}>
      {children}
    </AnswersHeadlessContext.Provider>
  )
}
