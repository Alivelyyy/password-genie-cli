const crypto = require('crypto');

const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const DIGITS = '0123456789';
const SPECIAL = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

function getRandomChar(charSet) {
  const index = crypto.randomInt(charSet.length);
  return charSet[index];
}

function generate(length, options = {}) {
  let charSet = LOWERCASE;
  let password = '';

  if (options.uppercase) {
    password += getRandomChar(UPPERCASE);
    charSet += UPPERCASE;
  }

  if (options.numbers) {
    password += getRandomChar(DIGITS);
    charSet += DIGITS;
  }

  if (options.specialChars) {
    password += getRandomChar(SPECIAL);
    charSet += SPECIAL;
  }

  for (let i = password.length; i < length; i++) {
    password += getRandomChar(charSet);
  }

  return password;
}

module.exports = { generate };
