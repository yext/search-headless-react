# Answers Headless React

answers-headless-react is the official React UI Bindings layer for @yext/answers-headless.
It lets your React components read data from a answers-headless, and dispatch actions to update state.

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

## License

Yext Answers-core is an open-sourced library licensed under the [BSD-3 License](./LICENSE).

## Development

First, run `npm install`, and then `npm run install-sample-app` to set up the testing app.

Then, run `npm start` to kick off the development server.
Finally, run `npm run watch` (in a separate terminal) to rebuild the react bindings layer whenever source code changes are mode.

The development server will automatically reload when updates are made to the build output folder, or any of the sample-app source code.
