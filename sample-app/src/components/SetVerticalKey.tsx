import { AnswersActionsContext } from '@yext/answers-headless-react';
import { Component, Fragment, ReactChild, ReactChildren } from 'react';
import { AnswersActions } from '@yext/answers-headless-react';

interface PropsWithChildren {
  children?: ReactChildren | ReactChild | (ReactChildren | ReactChild)[]
}

/**
 * Temporary place to set the verticalKey. This cannot be done in a useEffect hook,
 * because useEffect only occurs after the component is finished rendering.
 *
 * We need the verticalKey to be set before any child components execute
 * searches in useEffect hooks.
 */
export default class SetVerticalKey extends Component<PropsWithChildren> {
  constructor(props: PropsWithChildren, answersActions: AnswersActions) {
    super(props);
    answersActions.setVerticalKey('people');
  }

  render() {
    return <Fragment>{this.props.children}</Fragment>;
  }
}

SetVerticalKey.contextType = AnswersActionsContext;