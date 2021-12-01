import { AnswersHeadless } from '@yext/answers-headless';
import { useContext } from 'react';
import { AnswersHeadlessContext } from './AnswersHeadlessContext';

export type AnswersActions = AnswersHeadless;

export function useAnswersActions(): AnswersActions {
  const answersHeadless = useContext(AnswersHeadlessContext);
  if (answersHeadless.state === undefined) {
    throw new Error('Attempt to use AnswersHeadless before it\'s initialized.'
     + ' Ensure that \'useAnswersActions()\' is call within an AnswersHeadlessProvider component.');
  }
  return answersHeadless;
}