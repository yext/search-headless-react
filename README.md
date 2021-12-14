# Answers Headless React

Answers Headless React is the official React UI Bindings layer for [Answers Headless](https://www.npmjs.com/package/@yext/answers-headless).

Written in 100% TypeScript.

<div>
  <a href="https://npmjs.org/package/@yext/answers-headless-react">
    <img src="https://img.shields.io/npm/v/@yext/answers-headless-react" alt="NPM version"/>
  </a>
  <a href="./LICENSE">
    <img src="https://img.shields.io/badge/License-BSD%203--Clause-blue.svg" alt="License"/>
  </a>
  <a href='https://coveralls.io/github/yext/answers-headless-react?branch=main'>
    <img src='https://coveralls.io/repos/github/yext/answers-headless-react/badge.svg?branch=main' alt='Coverage Status' />
  </a>
</div>
<br>

## Installation

```shell
npm install @yext/answers-headless-react
```

## Getting Started - `AnswersHeadlessProvider`

Answers Headless React includes an `<AnswersHeadlessProvider />` component, which instantiates an AnswersHeadless instance and makes it available to the rest of your app.

```tsx
import { AnswersHeadlessProvider } from '@yext/answers-headless-react';
import SearchBar from './SearchBar';
import MostRecentSearch from './MostRecentSearch';
import UniversalResults from './UniversalResults';

function MyApp() {
  return (
    <AnswersHeadlessProvider
      apiKey='your api key'
      experienceKey='your experience key'
      locale='en'
    >
      {/* Add components that use Answers as children */}
      <SearchBar/>
      <MostRecentSearch/>
      <UniversalResults/>
    </AnswersHeadlessProvider>
  );
}
```

## Respond to State Updates with `useAnswersState`

`useAnswersState` reads a value from the `AnswersHeadless` state and subscribes to updates.

```tsx
import { useAnswersState } from '@yext/answers-headless-react';

export default function MostRecentSearch() {
  const mostRecentSearch = useAnswersState(state => state.query.mostRecentSearch);
  return <div>Showing results for {mostRecentSearch}</div>;
}
```

## Dispatch Actions with `useAnswersActions`

`useAnswersActions` allows you to dispatch actions using the `AnswersHeadless` instance.

These include performing searches, getting autocomplete suggestions, and adding filters.

For a full list of capabilities see [the answers-headless docs](https://www.npmjs.com/package/@yext/answers-headless).

```tsx
import { useAnswersActions } from '@yext/answers-headless-react';
import { ChangeEvent, KeyboardEvent, useCallback } from 'react';

function SearchBar() {
  const answers = useAnswersActions();
  const handleTyping = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    answers.setQuery(e.target.value);
  }, [answers]);
  
  const handleKeyDown = useCallback((evt: KeyboardEvent<HTMLInputElement>) => {
    if (evt.key === 'Enter' ) {
      answers.executeUniversalQuery();
    }
  }, [answers]);

  return <input onChange={handleTyping} onKeyDown={handleKeyDown}/>;
}
```

## Class Components

For users that want to use class components instead of functional components, you can use the `AnswersHeadlessContext` directly to dispatch actions, and the `subscribeToStateUpdates` HOC to receive updates from state.

These also work with functional components.

## `subscribeToStateUpdates`

Here is our MostRecentSearch component again, rewritten as a class with `subscribeToStateUpdates`.

```tsx
import { subscribeToStateUpdates } from '@yext/answers-headless-react';
import { Component } from 'react';

interface Props {
  mostRecentSearch: string
}

class MostRecentSearch extends Component<Props> {
  render() {
    return <div>Showing results for {this.props.mostRecentSearch}</div>;
  }
}

export default subscribeToStateUpdates(state => ({
  mostRecentSearch: state.query.mostRecentSearch
}))(MostRecentSearch);
```

## `AnswersHeadlessContext`

And here is our simple SearchBar again, rewritten as a class using `AnswersHeadlessContext`.

```tsx
import { AnswersHeadlessContext, AnswersHeadless } from '@yext/answers-headless-react';
import { Component } from 'react';

export default class Searcher extends Component {
  static contextType = AnswersHeadlessContext;

  render() {
    const answers: AnswersHeadless = this.context;
    return <input
      onChange={evt => answers.setQuery(evt.target.value)}
      onKeyDown={evt => {
        if (evt.key === 'Enter') {
          answers.executeUniversalQuery();
        }
      }}
    />
  }
}
```

## `useAnswersUtilities`

We offer a `useAnswersUtilities` convenience hook for accessing `AnswersHeadless.utilities`, which offers a number of stateless utility methods.
The `answersUtilities` and `answersUtilitiesFromActions` variables below are equivalent.

For class components, you can access `AnswersUtilities` through `AnswersHeadlessContext`.

```ts
const answersUtilities = useAnswersUtilities();
const answersUtilitiesFromActions = useAnswersActions().utilities;
```
