import { StatefulCore } from '@yext/answers-headless';
import { useContext } from 'react';
import { AnswersActionsContext } from './AnswersActionsContext';

export type AnswersActions = StatefulCore;

export function useAnswersActions(): AnswersActions {
  return useContext(AnswersActionsContext);
}