import { useSearchActions } from '../src';
import { render } from '@testing-library/react';

it('invoke useSearchActions outside of SearchHeadlessContext', () => {
  function Test(): JSX.Element {
    const searchActions = useSearchActions();
    searchActions.setQuery('');
    return <div>Test</div>;
  }
  jest.spyOn(global.console, 'error').mockImplementation();
  const expectedError = new Error(
    'Attempted to call useSearchActions() outside of a SearchHeadlessContext.' +
    ' Please ensure that \'useSearchActions()\' is called within the scope of a SearchHeadlessContext.');
  expect(() => render(<Test />)).toThrow(expectedError);
  jest.clearAllMocks();
});