const _ = require('lodash');

const BASE_ALPHABET = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ];

const FULL_ALPHABET_LIST = _.concat(BASE_ALPHABET, [ '_' ]);

const FULL_ALPHABET = _(FULL_ALPHABET_LIST)
  .map((character, index) => [ character, index ])
  .fromPairs()
  .value();

const SPACES_MAP = {
  ZERO_WIDTH_SPACE: String.fromCharCode(0x200B),
  MONGOLIAN_VOWEL_SEPARATOR: String.fromCharCode(0x180E),
  A: String.fromCharCode(0x200C),
  B: String.fromCharCode(0x200D),
  C: String.fromCharCode(0x2060),
  ZERO_WIDTH_NO_BREAK_SPACE: String.fromCharCode(0xFEFF)
};

const SPACES = _.values(SPACES_MAP);

const ENCODING_BASE = _.size(SPACES);

const ENCODED_CHARACTER_SIZE = _(new Array(8).fill(''))
  .map((value, index) => index)
  .find((number) => Math.pow(ENCODING_BASE, number) >= _.size(BASE_ALPHABET)); // TODO: when changing invisible spaces list size, what happens for indexes that don't have a matching character

const SUPPORTED_CHARACTERS = _.take(FULL_ALPHABET_LIST, Math.pow(ENCODING_BASE, ENCODED_CHARACTER_SIZE));

const splitAt = ({ index, text }) => {
  return {
    head: text.slice(0, index),
    tail: text.slice(index)
  };
};

const toto = 1;
console.log(toto.toString(6));

module.exports = {
  SPACES,
  FULL_ALPHABET_LIST, FULL_ALPHABET,
  ENCODING_BASE, ENCODED_CHARACTER_SIZE,
  SUPPORTED_CHARACTERS, // TODO: validate input against this
  splitAt
};
