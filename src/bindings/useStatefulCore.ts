import { useContext } from 'react';
import { StatefulCoreContext } from './StatefulCoreContext';

export function useStatefulCore() {
  const statefulCore = useContext(StatefulCoreContext);
  if (!statefulCore) {
    throw new Error('useStatefulCore must be used within a StatefulCoreProvider')
  }
  return statefulCore;
}