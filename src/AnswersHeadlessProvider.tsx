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
  if (sessionTrackingEnabled) {
    const sessionId = acquireSessionId();
    sessionId && answers.setSessionId(sessionId);
  }
  return (
    <AnswersHeadlessContext.Provider value={answers}>
      {children}
    </AnswersHeadlessContext.Provider>
  );
}

function acquireSessionId(): string | null {
  try {
    let sessionId = window.sessionStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = uuidv4();
      window.sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  } catch (err) {
    console.warn('Unable to use browser sessionStorage for sessionId.\n', err);
    return null;
  }
}