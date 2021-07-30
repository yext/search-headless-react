import { useContext } from 'react';
import { AnswersHeadlessContext } from './AnswersHeadlessContext';

export function useStoreActions() {
  const storeActions = useContext(AnswersHeadlessContext);
  if (!storeActions) {
    throw new Error('useStoreActions must be used within an AnswersHeadlessProvider')
  }
  return storeActions;
}