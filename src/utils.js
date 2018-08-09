const _ = require('lodash');
const { spawn } = require('child_process');

const BASE_ALPHABET = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ];
const NUMBERS = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' ];
const PUNCTUATION_MARKS = [ '_', '-', '.' ];

const FULL_ALPHABET_LIST = _.concat(NUMBERS, BASE_ALPHABET, PUNCTUATION_MARKS);

const FULL_ALPHABET = _.reduce(FULL_ALPHABET_LIST, (seed, character, index) => ({ ...seed, [ character ]: index }), {});

/**
 * Characters found on https://en.wikipedia.org/wiki/Whitespace_character (second table)
 */

// Removed because it shows up in git logs: MONGOLIAN_VOWEL_SEPARATOR: String.fromCharCode(0x180E)
const SPACES_MAP = {
  ZERO_WIDTH_SPACE: String.fromCharCode(0x200B),
  ZERO_WIDTH_NON_JOINER: String.fromCharCode(0x200C),
  ZERO_WIDTH_JOINER: String.fromCharCode(0x200D),
  WORD_JOINER: String.fromCharCode(0x2060),
  ZERO_WIDTH_NO_BREAK_SPACE: String.fromCharCode(0xFEFF)
};

const SPACES = _.values(SPACES_MAP);

const ENCODING_BASE = _.size(SPACES);

const ENCODED_CHARACTER_SIZE = _(new Array(8).fill(''))
  .map((value, index) => index)
  .find((number) => Math.pow(ENCODING_BASE, number) >= _.size(BASE_ALPHABET));

const SUPPORTED_CHARACTERS = _.take(FULL_ALPHABET_LIST, Math.pow(ENCODING_BASE, ENCODED_CHARACTER_SIZE));

const splitAt = ({ text, index }) => {
  return {
    head: text.slice(0, index),
    tail: text.slice(index)
  };
};

const toClipboard = (text) => {
  return new Promise((resolve, reject) => {
    const child = spawn('xclip', [ '-sel', 'clipboard', '-l', '1' ]);
    child
      .on('exit', () => resolve(text))
      .on('error', (error) => reject(error));

    child.stdin.end(text);
  });
};

module.exports = {
  SPACES,
  NUMBERS, BASE_ALPHABET, PUNCTUATION_MARKS,
  FULL_ALPHABET_LIST, FULL_ALPHABET,
  ENCODING_BASE, ENCODED_CHARACTER_SIZE,
  SUPPORTED_CHARACTERS,
  splitAt,
  toClipboard
};
