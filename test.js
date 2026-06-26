const passwordGenie = require('./index');

describe('passwordGenie', () => {
  it('generates a password of the specified length', () => {
    const password = passwordGenie.generate(12);
    expect(password.length).toBe(12);
  });

  it('includes uppercase letters when requested', () => {
    const password = passwordGenie.generate(12, { uppercase: true });
    expect(password).toEqual(expect.stringMatching(/[A-Z]/));
  });

  it('includes numbers when requested', () => {
    const password = passwordGenie.generate(12, { numbers: true });
    expect(password).toEqual(expect.stringMatching(/[0-9]/));
  });

  it('includes special characters when requested', () => {
    const password = passwordGenie.generate(12, { specialChars: true });
    expect(password).toEqual(expect.stringMatching(/[^a-zA-Z0-9]/));
  });

  it('includes all character types when all options enabled', () => {
    const password = passwordGenie.generate(20, {
      uppercase: true,
      numbers: true,
      specialChars: true,
    });
    expect(password.length).toBe(20);
    expect(password).toEqual(expect.stringMatching(/[A-Z]/));
    expect(password).toEqual(expect.stringMatching(/[0-9]/));
    expect(password).toEqual(expect.stringMatching(/[^a-zA-Z0-9]/));
  });
});
