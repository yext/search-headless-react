import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Result } from '@yext/answers-core';
import { provideStatefulCore } from '@yext/answers-headless';
import React, { useCallback } from 'react';
import { AnswersActionsContext, useAnswersActions, useAnswersState } from '../src';

it('does not perform extra renders or stateful-core listener registrations', async () => {
  const parentStateUpdates: Result[][] = [];
  const childStateUpdates: string[] = [];
  let pendingVerticalQuery;
  function Test() {
    const actions = useAnswersActions();
    const results = useAnswersState(state => {
      return state?.vertical?.results?.verticalResults.results;
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
    const queryId = useAnswersState(state => {
      return state.vertical.results?.queryId;
    }) || '';
    childStateUpdates.push(queryId);

    return (
      <div>
        <div>{queryId}:</div>
        <div>{JSON.stringify(results)}</div>
      </div>
    );
  }

  const statefulCore = createStatefulCore();
  const addListenerSpy = jest.spyOn(statefulCore, 'addListener');
  expect(addListenerSpy).toHaveBeenCalledTimes(0);
  expect(parentStateUpdates).toHaveLength(0);
  expect(childStateUpdates).toHaveLength(0);
  render(
    <AnswersActionsContext.Provider value={statefulCore}>
      <Test />
    </AnswersActionsContext.Provider>
  );
  expect(addListenerSpy).toHaveBeenCalledTimes(1);
  expect(parentStateUpdates).toHaveLength(1);
  expect(childStateUpdates).toHaveLength(0);

  await act(async () => {
    userEvent.click(screen.getByText('Search'));
    await pendingVerticalQuery;
  });
  // Check that only a single addListener call is made for the conditionally rendered Child
  expect(addListenerSpy).toHaveBeenCalledTimes(2);
  expect(parentStateUpdates).toHaveLength(2);
  expect(childStateUpdates).toHaveLength(1);

  await act(async () => {
    userEvent.click(screen.getByText('Search'));
    await pendingVerticalQuery;
  });
  await pendingVerticalQuery;
  // Check that additional addListener calls are not made
  expect(addListenerSpy).toHaveBeenCalledTimes(2);
  expect(parentStateUpdates).toHaveLength(3);
  expect(childStateUpdates).toHaveLength(2);
});

function createStatefulCore() {
  const statefulCore = provideStatefulCore({
    apiKey: 'fake api key',
    experienceKey: 'fake exp key',
    locale: 'en',
  });
  statefulCore.setVerticalKey('fakeVerticalKey');
  return statefulCore;
}