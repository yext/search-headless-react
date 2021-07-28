import { ComponentType, useMemo,} from 'react';
import { useStatefulCore } from './useStatefulCore';

export function connectToStatefulCore(WrappedComponent: ComponentType<any>) {
  return function StatefulCoreConsumer(props: any) {
    const statefulCore = useStatefulCore();
    return useMemo(() =>
      <WrappedComponent statefulCore={statefulCore} {...props}/>,
      [props, statefulCore]
    );
  }
}
