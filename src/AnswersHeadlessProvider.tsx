import { ReactChild, ReactChildren } from 'react';
import { provideAnswersHeadless, AnswersHeadless, AnswersConfig } from '@yext/answers-headless';
import { AnswersHeadlessContext } from './AnswersHeadlessContext';
import { v4 as uuidv4 } from 'uuid';

type Props = AnswersConfig & {
  children?: ReactChildren | ReactChild | (ReactChildren | ReactChild)[],
  verticalKey?: string,
  sessionTrackingEnabled?: boolean
};

export function AnswersHeadlessProvider(props: Props): JSX.Element {
  const { children, verticalKey, sessionTrackingEnabled=true, ...answersConfig } = props;
  const answers: AnswersHeadless = provideAnswersHeadless(answersConfig);
  verticalKey && answers.setVerticalKey(verticalKey);
  answers.setSessionTrackingEnabled(sessionTrackingEnabled);
  if (sessionTrackingEnabled && !answers.state.sessionTracking.sessionId) {
    answers.setSessionId(uuidv4());
  }
  return (
    <AnswersHeadlessContext.Provider value={answers}>
      {children}
    </AnswersHeadlessContext.Provider>
  );
}
