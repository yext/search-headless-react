import { SearchHeadless } from '@yext/search-headless';
import { createContext } from 'react';

// The default is empty because we don't know the user's config yet
export const SearchHeadlessContext = createContext<SearchHeadless>({} as SearchHeadless);