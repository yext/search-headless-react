import { AnswersHeadless } from '@yext/answers-headless';
import { useContext } from 'react';
import { AnswersHeadlessContext } from './AnswersHeadlessContext';

export type AnswersUtilities = AnswersHeadless['utilities'];

export function useAnswersUtilities(): AnswersUtilities {
  return useContext(AnswersHeadlessContext).utilities;
}