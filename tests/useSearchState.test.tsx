import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { provideHeadless, Result, State } from '@yext/search-headless';
import React, { useCallback, useReducer } from 'react';
import { SearchHeadlessContext, useSearchActions, useSearchState } from '../src';
import { renderToString } from 'react-dom/server';

it('invoke useSearchState outside of SearchHeadlessProvider', () => {
  function Test(): React.ReactElement {
    const query = useSearchState(state => state.query.input);
    return <div>{query}</div>;
  }
  jest.spyOn(global.console, 'error').mockImplementation();
  const expectedError = new Error(
    'Attempted to call useSearchState() outside of SearchHeadlessProvider.' +
    ' Please ensure that \'useSearchState()\' is called within an SearchHeadlessProvider component.');
  expect(() => render(<Test />)).toThrow(expectedError);
  jest.clearAllMocks();
});

it('Retrieves state snapshot during server side rendering and hydration process', async () => {
  const search = createSearchHeadless();
  const mockedOnClick= jest.fn().mockImplementation(() => {
    search.setVertical('anotherFakeKey');
  });
  function Test(): React.ReactElement {
    const verticalKey = useSearchState(state => state.vertical.verticalKey);
    return <button onClick={mockedOnClick}>{verticalKey}</button>;
  }
  function App(): React.ReactElement {
    return (
      <SearchHeadlessContext.Provider value={search}>
        <Test />
      </SearchHeadlessContext.Provider>
    );
  }
  const renderOnServer = () => renderToString(<App />);
  expect(renderOnServer).not.toThrow();

  const container = document.body.appendChild(document.createElement('div'));
  container.innerHTML = renderOnServer();
  userEvent.click(screen.getByText('fakeVerticalKey'));
  expect(mockedOnClick).toBeCalledTimes(0);

  //attach event listeners to the existing markup
  render(<App />, { container, hydrate: true });
  await userEvent.click(screen.getByText('fakeVerticalKey'));
  expect(mockedOnClick).toBeCalledTimes(1);
  expect(screen.getByText('anotherFakeKey')).toBeDefined();
});

it('does not perform extra renders/listener registrations for nested components', async () => {
  const parentStateUpdates: Result[][] = [];
  const childStateUpdates: string[] = [];
  let pendingVerticalQuery;
  function Test() {
    const actions = useSearchActions();
    const results = useSearchState(state => {
      return state?.vertical?.results;
    }) || [];
    parentStateUpdates.push(results);
    const search = useCallback(() => {
      actions.setQuery('iphone');
      pendingVerticalQuery = actions.executeVerticalQuery();
    }, [actions]);

    return (
      <div>
        <button onClick={search}>Search</button>
        {!!results?.length && <Child results={results} />}
      </div>
    );
  }

  function Child({ results }: { results: Result[] }) {
    const queryId = useSearchState(state => {
      return state.query.queryId;
    }) || '';
    childStateUpdates.push(queryId);

    return (
      <div>
        <div>{queryId}:</div>
        <div>{JSON.stringify(results)}</div>
      </div>
    );
  }

  const search = createSearchHeadless();
  const addListenerSpy = jest.spyOn(search, 'addListener');
  expect(addListenerSpy).toHaveBeenCalledTimes(0);
  expect(parentStateUpdates).toHaveLength(0);
  expect(childStateUpdates).toHaveLength(0);
  render(
    <SearchHeadlessContext.Provider value={search}>
      <Test />
    </SearchHeadlessContext.Provider>
  );
  expect(addListenerSpy).toHaveBeenCalledTimes(1);
  expect(parentStateUpdates).toHaveLength(1);
  expect(childStateUpdates).toHaveLength(0);

  userEvent.click(screen.getByText('Search'));
  await act( async () => { await pendingVerticalQuery; });

  // Check that only a single addListener call is made for the conditionally rendered Child
  expect(addListenerSpy).toHaveBeenCalledTimes(2);
  expect(parentStateUpdates).toHaveLength(2);
  expect(childStateUpdates).toHaveLength(1);

  userEvent.click(screen.getByText('Search'));
  await act( async () => { await pendingVerticalQuery; });

  // Check that additional addListener calls are not made
  expect(addListenerSpy).toHaveBeenCalledTimes(2);
  expect(parentStateUpdates).toHaveLength(3);
  expect(childStateUpdates).toHaveLength(2);
});

it('does not trigger render on unmounted component', async () => {
  const consoleSpy = jest.spyOn(console, 'error');
  function ParentComponent() {
    const results = useSearchState(state => state.universal?.verticals) || [];
    return <div>{results.map((_, index) => <ChildComponent key={index}/>)}</div>;
  }

  function ChildComponent() {
    useSearchState(state => state);
    return <div>child component</div>;
  }

  const search = createSearchHeadless();
  render(
    <SearchHeadlessContext.Provider value={search}>
      <ParentComponent/>
    </SearchHeadlessContext.Provider>
  );
  act(() => search.setQuery('resultsWithFilter'));
  await act( async () => { await search.executeUniversalQuery(); });
  act(() => search.setQuery('default'));
  await act( async () => { await search.executeUniversalQuery(); });
  expect(consoleSpy).not.toHaveBeenCalledWith(
    expect.stringMatching('Can\'t perform a React state update on an unmounted component'),
    expect.anything(),
    expect.stringMatching('ChildComponent'));
});

describe('uses the most recent selector', () => {
  it('for determining the hook\'s return value', async () => {
    let selector = () => 'initial selector';

    function Test() {
      const selectedState: string = useSearchState(selector);
      const [, triggerRender] = useReducer(s => s + 1, 0);

      return (
        <>
          <button onClick={triggerRender}>rerender</button>
          <span data-testid='selected-state'>{selectedState}</span>
        </>
      );
    }

    const search = createSearchHeadless();
    render(
      <SearchHeadlessContext.Provider value={search}>
        <Test />
      </SearchHeadlessContext.Provider>
    );
    expect(screen.getByTestId('selected-state')).toHaveTextContent('initial selector');

    selector = () => 'new selector';
    await userEvent.click(screen.getByText('rerender'));
    expect(screen.getByTestId('selected-state')).toHaveTextContent('new selector');
  });

  it('for determining whether to trigger a rerender', async () => {
    type Selector = (state: State) => string | number | undefined;
    let selector: Selector = state => {
      return state.query.input;
    };
    const stateUpdates: (string | undefined | number)[] = [];

    function Test() {
      const selectedState: string | undefined | number = useSearchState(selector);
      const [, triggerRender] = useReducer(s => s + 1, 0);
      stateUpdates.push(selectedState);

      return (
        <>
          <button onClick={triggerRender}>rerender</button>
          <span data-testid='selected-state'>{selectedState}</span>
        </>
      );
    }

    const search = createSearchHeadless();
    search.setQuery('initial value');
    expect(stateUpdates).toHaveLength(0);
    render(
      <SearchHeadlessContext.Provider value={search}>
        <Test />
      </SearchHeadlessContext.Provider>
    );
    expect(stateUpdates).toEqual(['initial value']);

    let numNewSelectorCalls = 0;
    selector = () => {
      return ++numNewSelectorCalls;
    };
    await userEvent.click(screen.getByText('rerender'));

    expect(stateUpdates).toEqual(['initial value', 1]);

    act(() => {
      search.setContext('trigger a state update that would not update the initial selector');
    });
    expect(stateUpdates).toEqual(['initial value', 1, 3]);
  });
});

function createSearchHeadless() {
  return provideHeadless({
    apiKey: 'fake api key',
    experienceKey: 'fake exp key',
    locale: 'en',
    verticalKey: 'fakeVerticalKey'
  });
}
