const _ = require('lodash');

const path = require('path');

const {
  SPACES, FULL_ALPHABET, ENCODED_CHARACTER_SIZE, ENCODING_BASE, SUPPORTED_CHARACTERS,
  splitAt, toClipboard
} = require('../utils');

const command = path.parse(__filename).name;
const aliases = [ command.charAt(0) ];
const describe = 'Hide a string in another string';

const CONTAINER = {
  name: 'container',
  alias: 'c',
  describe: 'The string in which to hide a dirty secret',
  type: 'string'
};

const TO_CLIPBOARD = {
  name: 'to-clipboard',
  alias: 't',
  describe: 'Copies the result to the clipboard if xclip is installed in the machine',
  type: 'boolean',
  default: false
};

const SECRET = {
  name: 'secret',
  alias: 's',
  describe: 'The dirty secret to hide',
  type: 'string',
  coerce: (arg) => {
    const unsupportedCharacters = _(arg.split(''))
      .filter((character) => !_.includes(SUPPORTED_CHARACTERS, _.toUpper(character)))
      .value();

    if (!_.isEmpty(unsupportedCharacters)) {
      throw Error(_.size(unsupportedCharacters) > 1
        ? `The characters [ ${_.join(unsupportedCharacters, ', ')} ] are not supported.`
        : `The character ${_.join(unsupportedCharacters, ', ')} is not supported.`);
    }

    return arg;
  }
};

const textToZeroWidth = (text) => _(text.split(''))
  .map(_.toUpper)
  .map((upperCaseCharacter) => FULL_ALPHABET[ upperCaseCharacter ].toString(ENCODING_BASE))
  .map((characterCode) => _.padStart(characterCode, ENCODED_CHARACTER_SIZE, '0'))
  .map((baseN) => _.split(baseN, '')
    .map((digit) => SPACES[ parseInt(digit, 10) ])
    .join(''))
  .join('');

const hideArgs = (yargs) => yargs.usage(`usage: sneacret ${command} [options]`)
  .option(CONTAINER.name, CONTAINER)
  .option(SECRET.name, SECRET)
  .option(TO_CLIPBOARD.name, TO_CLIPBOARD)
  .help()
  .epilogue(`Supported characters: '${_.join(SUPPORTED_CHARACTERS, '')}'\nLower-case letters will be upper-cased.`);

const hideHandler = async (args) => {
  const container = args[ CONTAINER.name ];
  const secret = args[ SECRET.name ];
  const shouldCopyToClipboard = args[ TO_CLIPBOARD.name ];

  const split = splitAt({ text: container, index: 1 });

  const zeroWidthSecret = textToZeroWidth(secret);
  const result = `${split.head}${zeroWidthSecret}${split.tail}`;

  process.stdout.write(`${result}\n`);
  if (shouldCopyToClipboard) {
    await toClipboard(result);
  }
  return result;
};

module.exports = {
  command,
  aliases,
  describe,
  builder: hideArgs,
  handler: hideHandler
};
