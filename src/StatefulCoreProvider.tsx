import { ReactChild, ReactChildren } from 'react';
import { provideStatefulCore } from '@yext/answers-headless';
import { AnswersConfig } from '@yext/answers-core';
import { StatefulCoreContext } from './StatefulCoreContext';

interface Props extends AnswersConfig {
  verticalKey?: string
  children?: ReactChildren | ReactChild | ReactChildren[] | ReactChild[]
}

export function StatefulCoreProvider(props: Props) {
  const { children, verticalKey, ...answerConfig } = props;
  const statefulCore = provideStatefulCore(answerConfig)
  if (verticalKey) {
    statefulCore.setVerticalKey(verticalKey);
  }
  return (
    <StatefulCoreContext.Provider value={statefulCore}>
      {children}
    </StatefulCoreContext.Provider>
  )
}
