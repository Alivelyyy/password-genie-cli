# password-genie-cli

A simple and secure password generator that creates random, unique passwords based on user-defined length and complexity requirements.

## Install

```sh
npm install password-genie-cli
```

## Usage

```js
const passwordGenie = require('password-genie-cli');

// Generate a password of length 12 with default complexity (lowercase only)
const password = passwordGenie.generate(12);
console.log(password); // e.g. "kqxjwmfobqje"

// Generate a password of length 16 with custom complexity
const complexPassword = passwordGenie.generate(16, {
  uppercase: true,
  numbers: true,
  specialChars: true,
});
console.log(complexPassword); // e.g. "Y7$hL2#pQ9!mZ4&x"
```

## API

### `generate(length, options)`

| Param     | Type   | Default | Description                       |
| --------- | ------ | ------- | --------------------------------- |
| `length`  | number | —       | Length of the password to generate |
| `options` | object | `{}`    | Complexity options (see below)    |

**Options**

| Property       | Type    | Default | Description                |
| -------------- | ------- | ------- | -------------------------- |
| `uppercase`    | boolean | `false` | Include uppercase letters  |
| `numbers`      | boolean | `false` | Include numbers            |
| `specialChars` | boolean | `false` | Include special characters |

## Security

Uses Node.js `crypto.randomInt` — a cryptographically secure pseudo-random number generator (CSPRNG). No modulo bias.

## License

MIT
