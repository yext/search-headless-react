import { useAnswersActions } from '../src';
import { render } from '@testing-library/react';

it('invoke useAnswersActions outside of AnswersHeadlessProvider', () => {
  function Test(): JSX.Element {
    const answersActions = useAnswersActions();
    answersActions.setQuery('');
    return <div>Test</div>;
  }
  jest.spyOn(global.console, 'error').mockImplementation();
  try {
    render(<Test />);
  } catch(e) {
    expect(e).toEqual(new Error('Attempted to use AnswersHeadless before it\'s initialized.'
    + ' Please ensure that \'useAnswersActions()\' is called within an AnswersHeadlessProvider component.'));
  }
  jest.clearAllMocks();
});