import { server } from './server';
import '@testing-library/jest-dom';
import { TextEncoder } from 'util';

global.TextEncoder = TextEncoder as typeof global.TextEncoder;

type MessageHandler = ((event: { data: unknown }) => void) | null;

class MessagePortPolyfill {
  onmessage: MessageHandler = null;
  private peer?: MessagePortPolyfill;

  setPeer(peer: MessagePortPolyfill) {
    this.peer = peer;
  }

  postMessage(data: unknown) {
    const handler = this.peer?.onmessage;
    if (typeof handler === 'function') {
      setTimeout(() => handler({ data }), 0);
    }
  }

  start() {
    // No-op to match the browser API surface.
  }

  close() {
    this.onmessage = null;
  }
}

class MessageChannelPolyfill {
  port1: MessagePortPolyfill;
  port2: MessagePortPolyfill;

  constructor() {
    this.port1 = new MessagePortPolyfill();
    this.port2 = new MessagePortPolyfill();
    this.port1.setPeer(this.port2);
    this.port2.setPeer(this.port1);
  }
}

const globalWithMessageChannel = globalThis as unknown as {
  MessageChannel?: typeof MessageChannelPolyfill
};

// React 19 schedules work through MessageChannel in environments with the DOM polyfilled.
if (!globalWithMessageChannel.MessageChannel) {
  globalWithMessageChannel.MessageChannel = MessageChannelPolyfill;
}

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
