const _ = require('lodash');

const path = require('path');

const { BASE_ALPHABET, NUMBERS, PUNCTUATION_MARKS } = require('../utils');

const command = path.parse(__filename).name;
const aliases = [ command.charAt(0) ];
const describe = 'Display the list of supported characters for the secret';

const alphabetArgs = (yargs) => yargs.usage(`usage: sneacret ${command} [options]`).help();

const alphabetHandler = () => {
  process.stdout.write(`Supported characters:
* Numbers: ${JSON.stringify(NUMBERS)}
* Alphabet (upper-case): ${JSON.stringify(BASE_ALPHABET)}
* Punctuation marks: ${JSON.stringify(PUNCTUATION_MARKS)}

`);
};

module.exports = {
  command,
  aliases,
  describe,
  builder: alphabetArgs,
  handler: alphabetHandler
};
