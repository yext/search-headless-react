import { useAnswersActions } from '../src';
import { render } from '@testing-library/react';
import React from 'react';

it('invoke useAnswersActions outside of AnswersHeadlessProvider', () => {
  function Test(): JSX.Element {
    const answersActions = useAnswersActions();
    answersActions.setQuery('');
    return <div>Test</div>;
  }
  jest.spyOn(global.console, 'error').mockImplementation();
  const expectedError = new Error(
    'Attempted to call useAnswersActions() outside of AnswersHeadlessProvider.' +
    ' Please ensure that \'useAnswersActions()\' is called within an AnswersHeadlessProvider component.');
  expect(() => render(<Test />)).toThrow(expectedError);
  jest.clearAllMocks();
});