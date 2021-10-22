import { AnswersHeadless } from '@yext/answers-headless';
import { useContext } from 'react';
import { AnswersActionsContext } from './AnswersActionsContext';

export type AnswersUtilities = AnswersHeadless['utilities'];

export function useAnswersUtilities(): AnswersUtilities {
  return useContext(AnswersActionsContext).utilities;
}