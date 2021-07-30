import { ComponentType, useMemo } from 'react';
import { useStoreActions } from './useStoreActions';

export function decorateWithStore(WrappedComponent: ComponentType<any>) {
  return function AnswersHeadlessConsumer(props: any) {
    const storeActions = useStoreActions();
    return useMemo(() =>
      <WrappedComponent storeActions={storeActions} {...props}/>,
      [props, storeActions]
    );
  }
}
