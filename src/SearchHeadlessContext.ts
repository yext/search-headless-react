import { AnswersHeadless } from '@yext/answers-headless';
import { createContext } from 'react';

// The default is empty because we don't know the user's config yet
export const SearchHeadlessContext = createContext<AnswersHeadless>({} as AnswersHeadless);