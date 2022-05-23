import { PropsWithChildren } from 'react';
import { provideAnswersHeadless, AnswersHeadless, HeadlessConfig } from '@yext/answers-headless';
import { AnswersHeadlessContext } from './AnswersHeadlessContext';
import acquireSessionId from './utils/acquireSessionId';
import packageJson from '../package.json';

const { version } = packageJson;

type Props = HeadlessConfig & {
  verticalKey?: string,
  sessionTrackingEnabled?: boolean
};

export function AnswersHeadlessProvider(props: PropsWithChildren<Props>): JSX.Element {
  const { children, verticalKey, sessionTrackingEnabled=true, ...answersConfig } = props;
  const additionalHttpHeaders = {
    'Client-SDK': {
      ANSWERS_HEADLESS_REACT: version
    }
  };
  const answers: AnswersHeadless = provideAnswersHeadless(answersConfig, additionalHttpHeaders);

  verticalKey && answers.setVertical(verticalKey);
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
