describe('authentication', () => {

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('should return token', async () => {
    const token = 'token';
    jest.doMock('jsonwebtoken', () => ({
      sign: jest.fn((payload, options) => token),
    }));
    const auth = (await import('./auth'));
    expect(auth.generateSignedToken({ id: '123'})).toEqual(token);
  });

  it('should authenticate', async () => {
    const token = 'token';
    const driver = { id: '123' };
    const auth = (await import('./auth'));
    const cb = jest.fn((err, user) => user);
    // auth.authenticateCallback({}, )
    expect(auth.authenticateCallback(driver, cb)).toEqual(driver);
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb).toHaveBeenCalledWith(null, driver);
  });
});
