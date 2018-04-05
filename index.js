#!/usr/bin/env node

/* eslint-disable global-require,spaced-comment,no-unused-expressions,max-len */

/*************************
 *     REQUIRE LIBS      *
 ************************/

const _ = require('lodash');
const yargs = require('yargs');

/*************************
 *  REQUIRE GUT MODULES  *
 ************************/

// noinspection BadExpressionStatementJS
/*************************
 *   PROCESS ARGUMENTS   *
 ************************/

yargs
  .usage('usage: hide-show <command>')
  .command(require('./src/commands/hide'))
  .command(require('./src/commands/show'))

  // To check that Gut is installed or just mess around
  .command('groot', 'Display a random sentence, in French', () => process.stdout.write('Je s\'appelle Groot\n'))

  .demandCommand(1, 'Specify the command you want to run!'.red)
  .help()
  .version()
  .wrap(null)
  .epilogue('For more information, read the manual at https://github.com/quilicicf/HiddenString/blob/master/README.md')
  .argv;
