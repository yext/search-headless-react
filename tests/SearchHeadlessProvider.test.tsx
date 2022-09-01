import { SearchHeadlessProvider } from '../src';
import { render } from '@testing-library/react';
import { provideHeadless, SearchHeadless } from '@yext/search-headless';

jest.mock('@yext/search-headless', () => ({
  provideHeadless: jest.fn(() => { return {}; })
}));

it('does not change anything about the supplied Headless instance', () => {
  const config = {
    apiKey: '<apiKey>',
    experienceKey: '<experienceKey>',
    locale: 'en'
  };
  const searcher: SearchHeadless = provideHeadless(config);

  expect(
    () => render(<SearchHeadlessProvider searcher={searcher}></SearchHeadlessProvider>)).not.toThrowError();
});