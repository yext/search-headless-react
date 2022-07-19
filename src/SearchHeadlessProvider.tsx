import { PropsWithChildren } from 'react';
import { provideHeadless, SearchHeadless, HeadlessConfig } from '@yext/search-headless';
import { SearchHeadlessContext } from './SearchHeadlessContext';
import acquireSessionId from './utils/acquireSessionId';
import packageJson from '../package.json';

const { version } = packageJson;

type Props = HeadlessConfig & {
  verticalKey?: string,
  sessionTrackingEnabled?: boolean
};

export function SearchHeadlessProvider(props: PropsWithChildren<Props>): JSX.Element {
  const { children, verticalKey, sessionTrackingEnabled=true, ...answersConfig } = props;
  const additionalHttpHeaders = {
    'Client-SDK': {
      ANSWERS_HEADLESS_REACT: version
    }
  };
  const answers: SearchHeadless = provideHeadless(answersConfig, additionalHttpHeaders);

  verticalKey && answers.setVertical(verticalKey);
  answers.setSessionTrackingEnabled(sessionTrackingEnabled);
  if (sessionTrackingEnabled) {
    const sessionId = acquireSessionId();
    sessionId && answers.setSessionId(sessionId);
  }
  return (
    <SearchHeadlessContext.Provider value={answers}>
      {children}
    </SearchHeadlessContext.Provider>
  );
}