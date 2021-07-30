import React from 'react';
import { useContext } from 'react';
import { StatefulCoreContext } from './StatefulCoreContext';

// Add this in node_modules/react-dom/index.js
globalThis.React2 = React;

// useStoreActions
export function useStatefulCore() {
  const statefulCore = useContext(StatefulCoreContext);
  if (!statefulCore) {
    throw new Error('useStatefulCore must be used within a StatefulCoreProvider')
  }
  return statefulCore;
}