import { ReactChild, ReactChildren } from 'react';
import { provideStatefulCore } from '@yext/answers-headless';
import { AnswersConfig } from '@yext/answers-core';
import { AnswersActions, AnswersActionsContext } from './AnswersActionsContext';

interface Props extends AnswersConfig {
  children?: ReactChildren | ReactChild | (ReactChildren | ReactChild)[],
  verticalKey?: string
}

export function AnswersActionsProvider(props: Props): JSX.Element {
  const { children, verticalKey, ...answersConfig } = props;
  const answersActions: AnswersActions = provideStatefulCore(answersConfig);
  verticalKey && answersActions.setVerticalKey(verticalKey);
  return (
    <AnswersActionsContext.Provider value={answersActions}>
      {children}
    </AnswersActionsContext.Provider>
  );
}
