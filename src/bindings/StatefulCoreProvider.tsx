import { ReactChild, ReactChildren } from 'react';
import { provideStatefulCore } from '@yext/answers-headless';
import { AnswersConfig } from '@yext/answers-core';
import { StatefulCoreContext } from './StatefulCoreContext';

interface Props extends AnswersConfig {
  children?: ReactChildren | ReactChild | ReactChildren[] | ReactChild[]
}

export function StatefulCoreProvider(props: Props) {
  const { children, ...answerConfig } = props;
  const statefulCore = provideStatefulCore(answerConfig)
  return (
    <StatefulCoreContext.Provider value={statefulCore}>
      {children}
    </StatefulCoreContext.Provider>
  )
}
