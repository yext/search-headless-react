import { SearchHeadlessProvider, SandboxEndpoints } from '../src';
import { render } from '@testing-library/react';
import { provideHeadless } from '@yext/search-headless';

jest.mock('@yext/search-headless', () => ({
  provideHeadless: jest.fn(() => ({
    setSessionTrackingEnabled: jest.fn(),
    setSessionId: jest.fn()
  }))
}));

it('correctly passes through an answers config with sandbox endpoints', () => {
  const config = {
    apiKey: '<apiKey>',
    experienceKey: '<experienceKey>',
    locale: 'en',
    endpoints: SandboxEndpoints
  };

  render(<SearchHeadlessProvider {...config}/>);
  expect(provideHeadless).toHaveBeenCalledTimes(1);
  expect(provideHeadless).toHaveBeenCalledWith(config, expect.anything());
});