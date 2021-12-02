import { AnswersHeadless } from '@yext/answers-headless';
import { useContext } from 'react';
import { AnswersHeadlessContext } from './AnswersHeadlessContext';

export type AnswersActions = AnswersHeadless;

export function useAnswersActions(): AnswersActions {
  const answersHeadless = useContext(AnswersHeadlessContext);
  if (answersHeadless.state === undefined) {
    throw new Error('Attempted to call useAnswersActions() outside of AnswersHeadlessProvider.'
     + ' Please ensure that \'useAnswersActions()\' is called within an AnswersHeadlessProvider component.');
  }
  return answersHeadless;
}