import { AnswersHeadlessProvider, SandboxEndpoints } from '../src';
import { render } from '@testing-library/react';
import { provideAnswersHeadless } from '@yext/answers-headless';
import React from 'react';

jest.mock('@yext/answers-headless', () => ({
  provideAnswersHeadless: jest.fn(() => ({
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

  render(<AnswersHeadlessProvider {...config}/>);
  expect(provideAnswersHeadless).toHaveBeenCalledTimes(1);
  expect(provideAnswersHeadless).toHaveBeenCalledWith(config, expect.anything());
});