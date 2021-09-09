import { StatefulCore } from '@yext/answers-headless';
import { useContext } from 'react';
import { AnswersActionsContext } from '.';

export type AnswersActions = Omit<StatefulCore, 'state'>;

export function useAnswersActions(): AnswersActions {
  return useContext(AnswersActionsContext);
}