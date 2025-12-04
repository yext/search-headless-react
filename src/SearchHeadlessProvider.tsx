import React, { PropsWithChildren } from 'react';
import { SearchHeadless } from '@yext/search-headless';
import { SearchHeadlessContext } from './SearchHeadlessContext';

type Props = { searcher: SearchHeadless };

export function SearchHeadlessProvider(props: PropsWithChildren<Props>): React.ReactElement {
  const { children, searcher } = props;

  return (
    <SearchHeadlessContext.Provider value={searcher}>
      {children}
    </SearchHeadlessContext.Provider>
  );
}
