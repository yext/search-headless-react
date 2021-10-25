import { AnswersHeadless } from '@yext/answers-headless';
import { useContext } from 'react';
import { AnswersHeadlessContext } from './AnswersHeadlessContext';

export type AnswersActions = AnswersHeadless;

export function useAnswersActions(): AnswersActions {
  return useContext(AnswersHeadlessContext);
}