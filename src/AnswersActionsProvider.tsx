import { ReactChild, ReactChildren } from 'react';
import { provideStatefulCore, StatefulCore } from '@yext/answers-headless';
import { AnswersConfig } from '@yext/answers-core';
import { AnswersActionsContext } from './AnswersActionsContext';

interface Props extends AnswersConfig {
  children?: ReactChildren | ReactChild | (ReactChildren | ReactChild)[],
  verticalKey?: string
}

export function AnswersActionsProvider(props: Props): JSX.Element {
  const { children, verticalKey, ...answersConfig } = props;
  const statefulCore: StatefulCore = provideStatefulCore(answersConfig);
  verticalKey && statefulCore.setVerticalKey(verticalKey);
  return (
    <AnswersActionsContext.Provider value={statefulCore}>
      {children}
    </AnswersActionsContext.Provider>
  );
}
