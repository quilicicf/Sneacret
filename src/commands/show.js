const _ = require('lodash');

const path = require('path');

const { SPACES, FULL_ALPHABET_LIST, ENCODING_BASE, ENCODED_CHARACTER_SIZE } = require('../utils');

const command = path.parse(__filename).name;
const aliases = [ command.charAt(0) ];
const describe = 'Show the dirty secrets hidden inside a string';

const CONTAINER = {
  name: 'container',
  alias: 'c',
  describe: 'The string containing the dirty secret',
  type: 'string'
};

const extractSecret = (text) => _(text.split(''))
  .filter((character) => _.includes(SPACES, character))
  .map((space) => SPACES.indexOf(space))
  .chunk(ENCODED_CHARACTER_SIZE)
  .map((chunk) => _.join(chunk, ''))
  .map((baseN) => parseInt(baseN, ENCODING_BASE))
  .map((baseTenNumber) => FULL_ALPHABET_LIST[ baseTenNumber ])
  .join('');

const showArgs = (yargs) => yargs.usage(`usage: sneacret ${command} [options]`)
  .option(CONTAINER.name, CONTAINER)
  .help();

const showHandler = (args) => {
  const container = args[ CONTAINER.name ];
  const secret = extractSecret(container);

  process.stdout.write(`${secret}\n`);

  return secret;
};

module.exports = {
  command,
  aliases,
  describe,
  builder: showArgs,
  handler: showHandler
};
