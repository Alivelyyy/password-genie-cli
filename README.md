# password-genie-cli

A simple and secure password generator that creates random, unique passwords based on user-defined length and complexity requirements.

## Install

```sh
npm install password-genie-cli
```

## API

```js
const { generate, generateMultiple, generatePassphrase, analyze } = require('password-genie-cli');
```

### `generate(length, options)`

Returns a random password as a string.

| Param     | Type   | Default | Description                       |
| --------- | ------ | ------- | --------------------------------- |
| `length`  | number | —       | Length of the password to generate |
| `options` | object | `{}`    | Complexity options (see below)    |

**Options**

| Property         | Type    | Default | Description                                |
| ---------------- | ------- | ------- | ------------------------------------------ |
| `uppercase`      | boolean | `false` | Include uppercase letters                  |
| `numbers`        | boolean | `false` | Include numbers                            |
| `specialChars`   | boolean | `false` | Include special characters                 |
| `excludeSimilar` | boolean | `false` | Exclude similar chars (e.g. `0O1lI`)       |
| `exclude`        | string  | `''`    | Characters to exclude from the charset     |

```js
generate(16, { uppercase: true, numbers: true, specialChars: true });
generate(12, { excludeSimilar: true, exclude: '!@#' });
```

### `generateMultiple(count, length, options)`

Returns an array of unique passwords.

```js
const passwords = generateMultiple(5, 16, { uppercase: true, numbers: true });
```

### `generatePassphrase(options)`

Returns an XKCD-style word-based passphrase.

| Option      | Type    | Default  | Description                              |
| ----------- | ------- | -------- | ---------------------------------------- |
| `words`     | number  | `4`      | Number of words in the passphrase        |
| `separator` | string  | `'-'`    | Separator between words                  |
| `capitalize`| boolean | `true`   | Capitalize each word                     |

```js
generatePassphrase();
// "Correct-Horse-Battery-Staple"

generatePassphrase({ words: 3, separator: '.', capitalize: false });
// "correct.horse.battery"
```

### `analyze(password)`

Returns `{ entropy, strength, charsetSize }` for a given password.

```js
analyze('HelloWorld123!');
// { entropy: 79.3, strength: 'strong', charsetSize: 95 }
```

**Strength scale:**
- `< 40` bits — weak
- `40–60` — moderate
- `60–80` — strong
- `> 80` — very strong

## CLI

When installed globally or used with `npx`:

```sh
# Generate a password
password-genie --length=16 --uppercase --numbers --specialChars

# Generate multiple passwords
password-genie --length=20 --uppercase --numbers --specialChars --count=5 --strength

# Generate a passphrase
password-genie passphrase --words=4 --separator=-

# Analyze a password
password-genie analyze "MyP@ssw0rd!"
```

## Security

Uses Node.js `crypto.randomInt` — a cryptographically secure pseudo-random number generator (CSPRNG). No modulo bias. Passphrase wordlist contains ~1000 common English words.

## License

MIT
