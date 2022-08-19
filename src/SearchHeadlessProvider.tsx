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
  const { children, verticalKey, sessionTrackingEnabled=true, ...searchConfig } = props;
  const additionalHttpHeaders = {
    'Client-SDK': {
      ANSWERS_HEADLESS_REACT: version
    }
  };
  const search: SearchHeadless = provideHeadless(searchConfig, additionalHttpHeaders);

  verticalKey && search.setVertical(verticalKey);
  search.setSessionTrackingEnabled(sessionTrackingEnabled);
  if (sessionTrackingEnabled) {
    const sessionId = acquireSessionId();
    sessionId && search.setSessionId(sessionId);
  }
  return (
    <SearchHeadlessContext.Provider value={search}>
      {children}
    </SearchHeadlessContext.Provider>
  );
}