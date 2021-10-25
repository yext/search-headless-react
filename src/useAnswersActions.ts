import { AnswersHeadless } from '@yext/answers-headless';
import { useContext } from 'react';
import { AnswersActionsContext } from './AnswersActionsContext';

export type AnswersActions = AnswersHeadless;

export function useAnswersActions(): AnswersActions {
  return useContext(AnswersActionsContext);
}