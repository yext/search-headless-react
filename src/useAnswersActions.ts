import { useContext } from 'react';
import { AnswersActions, AnswersActionsContext } from './AnswersActionsContext';

export function useAnswersActions(): AnswersActions {
  return useContext(AnswersActionsContext);
}