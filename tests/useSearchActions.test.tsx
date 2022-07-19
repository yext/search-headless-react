import { useSearchActions } from '../src';
import { render } from '@testing-library/react';

it('invoke useSearchActions outside of SearchHeadlessProvider', () => {
  function Test(): JSX.Element {
    const searchActions = useSearchActions();
    searchActions.setQuery('');
    return <div>Test</div>;
  }
  jest.spyOn(global.console, 'error').mockImplementation();
  const expectedError = new Error(
    'Attempted to call useSearchActions() outside of SearchHeadlessProvider.' +
    ' Please ensure that \'useSearchActions()\' is called within an SearchHeadlessProvider component.');
  expect(() => render(<Test />)).toThrow(expectedError);
  jest.clearAllMocks();
});