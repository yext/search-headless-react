import acquireSessionId from '../../src/utils/acquireSessionId';

const uuidString = 'some-uuid-value';
const mockUuid = jest.fn(() => uuidString);
jest.mock('uuid', () => ({
  v4: () => mockUuid()
}));


describe('handle session id properly', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('session id exist in session storage', () => {
    window.sessionStorage.setItem('sessionId', 'some-uuid-in-storage');
    expect(acquireSessionId()).toEqual('some-uuid-in-storage');
  });

  it('session id does not exist in session storage', () => {
    expect(acquireSessionId()).toEqual('some-uuid-value');
    expect(window.sessionStorage.getItem('sessionId')).toEqual(uuidString);
  });

  it('error using session storage', () => {
    Object.defineProperty(window, 'sessionStorage', {
      value: { getItem: () => { throw Error(); } }
    });
    const consoleWarnSpy = jest.spyOn(global.console, 'warn').mockImplementation();
    expect(acquireSessionId()).toEqual(null);
    expect(consoleWarnSpy).toHaveBeenLastCalledWith(
      expect.stringContaining('Unable to use browser sessionStorage for sessionId.'),
      expect.anything()
    );
    consoleWarnSpy.mockClear();
  });
});
