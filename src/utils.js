const _ = require('lodash');

const FULL_ALPHABET_LIST = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '_' ];

const FULL_ALPHABET = _(FULL_ALPHABET_LIST)
  .map((character, index) => [ character, index ])
  .fromPairs()
  .value();

const SPACES_MAP = {
  ZERO_WIDTH_SPACE: String.fromCharCode(0x200B),
  MONGOLIAN_VOWEL_SEPARATOR: String.fromCharCode(0x180E),
  ZERO_WIDTH_NO_BREAK_SPACE: String.fromCharCode(0xFEFF)
};

const SPACES = _.values(SPACES_MAP);

const splitAt = ({ index, text }) => {
  return {
    head: text.slice(0, index),
    tail: text.slice(index)
  };
};

module.exports = { SPACES, FULL_ALPHABET_LIST, FULL_ALPHABET, splitAt };
