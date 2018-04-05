const _ = require('lodash');

const path = require('path');

const { SPACES, FULL_ALPHABET, ENCODED_CHARACTER_SIZE, ENCODING_BASE, splitAt } = require('../utils');

const command = path.parse(__filename).name;
const aliases = [ command.charAt(0) ];
const describe = 'Hide a string in another string';

const CONTAINER = {
  name: 'container',
  alias: 'c',
  describe: 'The string in which to hide a dirty secret',
  type: 'string'
};

const SECRET = {
  name: 'secret',
  alias: 's',
  describe: 'The dirty secret to hide',
  type: 'string'
};

const textToZeroWidth = (text) =>
  _(text.split(''))
    .map(_.toUpper)
    .map((upperCaseCharacter) => FULL_ALPHABET[ upperCaseCharacter ].toString(ENCODING_BASE))
    .map((characterCode) => _.padStart(characterCode, ENCODED_CHARACTER_SIZE, '0'))
    .map((ternaryNumber) => // TODO: not ternary ?
      _.split(ternaryNumber, '')
        .map((digit) => SPACES[ parseInt(digit, 10) ])
        .join(''))
    .join('');

const hideArgs = (yargs) => yargs.usage(`usage: hide-show ${command} [options]`)
  .option(CONTAINER.name, CONTAINER)
  .option(SECRET.name, SECRET)
  .help();

const hideHandler = (args) => {
  const container = args[ CONTAINER.name ];
  const secret = args[ SECRET.name ];

  const split = splitAt({ text: container, index: 1 });

  const zeroWidthSecret = textToZeroWidth(secret);
  const result = `${split.head}${zeroWidthSecret}${split.tail}`;

  process.stdout.write(`${result}\n`);
};

module.exports = {
  command,
  aliases,
  describe,
  builder: hideArgs,
  handler: hideHandler
};
