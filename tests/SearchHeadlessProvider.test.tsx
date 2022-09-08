import { SearchHeadlessProvider } from '../src';
import { render } from '@testing-library/react';
import { provideHeadless, SearchHeadless } from '@yext/search-headless';

jest.mock('@yext/search-headless', () => ({
  provideHeadless: jest.fn(() => { return {}; })
}));

it('Provider does not invoke any methods or attributes of the Searcher', () => {
  const config = {
    apiKey: '<apiKey>',
    experienceKey: '<experienceKey>',
    locale: 'en'
  };
  const searcher: SearchHeadless = provideHeadless(config);

  expect(
    () => render(<SearchHeadlessProvider searcher={searcher}></SearchHeadlessProvider>)).not.toThrowError();
});

it('Provider does decorate any methods in the Searcher', () => {
  const config = {
    apiKey: '<apiKey>',
    experienceKey: '<experienceKey>',
    locale: 'en'
  };
  const searcher: SearchHeadless = provideHeadless(config);
  const searcherProxy = new Proxy(searcher, { set() { throw new Error(); } });

  expect(() => render(
    <SearchHeadlessProvider searcher={searcherProxy}></SearchHeadlessProvider>)).not.toThrowError();
});