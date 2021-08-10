import { AnswersActionsContext } from '@yext/answers-headless-react';
import { Component, ComponentType } from 'react';
import { AnswersActions } from '@yext/answers-headless-react';

/**
 * Temporary place to set the verticalKey. This cannot be done in a useEffect hook,
 * because useEffect only occurs after the component is finished rendering.
 *
 * We need the verticalKey to be set before any child components execute
 * searches in useEffect hooks.
 */
export default function withVerticalKey(WrappedComponent: ComponentType<any>, verticalKey: string) {
  class SetVerticalKey extends Component {
    constructor(props: any, context: AnswersActions) {
      super(props);
      context.setVerticalKey(verticalKey);
    }
  
    render() {
      return <WrappedComponent {...this.props} />;
    }
  }
  
  SetVerticalKey.contextType = AnswersActionsContext;
  return SetVerticalKey
}