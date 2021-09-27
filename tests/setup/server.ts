import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { createVerticalQueryResponse } from './responses/vertical-query';

// Any unhandled requests are dropped and logged as warnings
const handlers = [
  rest.get(/answers\/vertical\/query/, (req, res, ctx) => {
    return res(
      ctx.json(createVerticalQueryResponse()),
    );
  })
];

export const server = setupServer(...handlers);
