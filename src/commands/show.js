const _ = require('lodash');

const path = require('path');

const { SPACES, FULL_ALPHABET_LIST } = require('../utils');

const command = path.parse(__filename).name;
const aliases = [ command.charAt(0) ];
const describe = 'Show the dirty secrets hidden inside a string';

const CONTAINER = {
  name: 'container',
  alias: 'c',
  describe: 'The string containing the dirty secret',
  type: 'string'
};

const extractSecret = (text) =>
  _(text.split(''))
    .filter((character) => _.includes(SPACES, character))
    .map((space) => SPACES.indexOf(space))
    .chunk(3)
    .map((chunk) => _.join(chunk, ''))
    .map((ternaryNumber) => parseInt(ternaryNumber, 3))
    .map((baseTenNumber) => FULL_ALPHABET_LIST[ baseTenNumber ])
    .join('');

const showArgs = (yargs) => yargs.usage(`usage: hide-show ${command} [options]`)
  .option(CONTAINER.name, CONTAINER)
  .help();

const showHandler = (args) => {
  const container = args[ CONTAINER.name ];
  process.stdout.write(`${extractSecret(container)}\n`);
};

module.exports = {
  command,
  aliases,
  describe,
  builder: showArgs,
  handler: showHandler
};
