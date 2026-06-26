const { generate, generateMultiple, generatePassphrase, analyze } = require('./index');

describe('generate', () => {
  it('generates a password of the specified length', () => {
    expect(generate(12).length).toBe(12);
  });

  it('includes uppercase letters when requested', () => {
    expect(generate(12, { uppercase: true })).toMatch(/[A-Z]/);
  });

  it('includes numbers when requested', () => {
    expect(generate(12, { numbers: true })).toMatch(/[0-9]/);
  });

  it('includes special characters when requested', () => {
    expect(generate(12, { specialChars: true })).toMatch(/[^a-zA-Z0-9]/);
  });

  it('includes all character types when all options enabled', () => {
    const password = generate(20, { uppercase: true, numbers: true, specialChars: true });
    expect(password.length).toBe(20);
    expect(password).toMatch(/[A-Z]/);
    expect(password).toMatch(/[0-9]/);
    expect(password).toMatch(/[^a-zA-Z0-9]/);
  });

  it('excludes similar characters when excludeSimilar is true', () => {
    for (let i = 0; i < 50; i++) {
      const password = generate(20, { uppercase: true, numbers: true, excludeSimilar: true });
      expect(password).not.toMatch(/[0O1lI|!]/);
    }
  });

  it('excludes specific characters when exclude is provided', () => {
    for (let i = 0; i < 50; i++) {
      const password = generate(20, { exclude: 'abc123' });
      expect(password).not.toMatch(/[abc123]/);
    }
  });
});

describe('generateMultiple', () => {
  it('returns the requested number of passwords', () => {
    const passwords = generateMultiple(5, 12);
    expect(passwords).toHaveLength(5);
  });

  it('each password has the specified length', () => {
    const passwords = generateMultiple(3, 16, { uppercase: true, numbers: true });
    passwords.forEach(p => expect(p.length).toBe(16));
  });

  it('returns unique passwords', () => {
    const passwords = generateMultiple(10, 32, { uppercase: true, numbers: true, specialChars: true });
    const unique = new Set(passwords);
    expect(unique.size).toBe(passwords.length);
  });
});

describe('generatePassphrase', () => {
  it('returns a passphrase with the default word count', () => {
    const passphrase = generatePassphrase();
    expect(passphrase.split('-')).toHaveLength(4);
  });

  it('respects custom word count', () => {
    const passphrase = generatePassphrase({ words: 6 });
    expect(passphrase.split('-')).toHaveLength(6);
  });

  it('uses custom separator', () => {
    const passphrase = generatePassphrase({ separator: '_' });
    expect(passphrase.split('_')).toHaveLength(4);
  });

  it('capitalizes words by default', () => {
    const passphrase = generatePassphrase({ words: 3 });
    const words = passphrase.split('-');
    words.forEach(w => expect(w.charAt(0)).toMatch(/[A-Z]/));
  });

  it('does not capitalize when capitalize is false', () => {
    const passphrase = generatePassphrase({ words: 3, capitalize: false });
    const words = passphrase.split('-');
    words.forEach(w => expect(w.charAt(0)).toMatch(/[a-z]/));
  });
});

describe('analyze', () => {
  it('returns correct entropy for a lowercase password', () => {
    const result = analyze('aaaa');
    expect(result.entropy).toBeCloseTo(4 * Math.log2(26), 1);
    expect(result.charsetSize).toBe(26);
  });

  it('returns weak strength for low entropy', () => {
    expect(analyze('abc').strength).toBe('weak');
  });

  it('returns very strong for high entropy', () => {
    expect(analyze('aB1!xyz9Qk#mW2$rT5v').strength).toBe('very strong');
  });

  it('detects charset size from mixed types', () => {
    const result = analyze('aA1!');
    expect(result.charsetSize).toBe(94);
  });
});
