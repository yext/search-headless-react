import { ReactChild, ReactChildren } from 'react';
import { provideStatefulCore } from '@yext/answers-headless';
import { AnswersConfig } from '@yext/answers-core';
import { AnswersActions, AnswersActionsContext } from './AnswersActionsContext';

interface Props extends AnswersConfig {
  verticalKey?: string
  children?: ReactChildren | ReactChild | (ReactChildren | ReactChild)[]
}

export function AnswersHeadlessProvider(props: Props): JSX.Element {
  const { children, verticalKey, ...answerConfig } = props;
  const storeActions: AnswersActions = provideStatefulCore(answerConfig);
  if (verticalKey) {
    storeActions.setVerticalKey(verticalKey);
  }
  return (
    <AnswersActionsContext.Provider value={storeActions}>
      {children}
    </AnswersActionsContext.Provider>
  );
}
