const _ = require('lodash');

const path = require('path');

const { handler: hide } = require('./hide');
const { handler: show } = require('./show');
const { SUPPORTED_CHARACTERS } = require('../utils');

const command = path.parse(__filename).name;
const aliases = [ command.charAt(0) ];
const describe = null; // Test the circle hide -> show

const CONTAINER = {
  name: 'container',
  alias: 'c',
  describe: 'The string containing the dirty secret',
  type: 'string'
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

const testArgs = (yargs) => yargs.usage(`usage: sneacret ${command} [options]`)
  .option(CONTAINER.name, CONTAINER)
  .option(SECRET.name, SECRET)
  .help();

const testHandler = async (args) => {
  process.stdout.write(`Extracted ${await show({ container: await hide(args) })}\n`);
};

module.exports = {
  command,
  aliases,
  describe,
  builder: testArgs,
  handler: testHandler
};
