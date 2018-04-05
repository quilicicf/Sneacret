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
  // .command(require('./src/commands/show'))

  // To check that Gut is installed or just mess around
  .command('groot', 'Display a random sentence, in French', () => process.stdout.write('Je s\'appelle Groot\n'))

  .demandCommand(1, 'Specify the command you want to run!'.red)
  .help()
  .version()
  .wrap(null)
  .epilogue('For more information, read the manual at https://github.com/quilicicf/HiddenString/blob/master/README.md')
  .argv;

// const main = (arguments) => {
//   if (arguments.length < 1) {
//     throw Error('Please provide a command to execute');
//   }
//
//   const commandName = arguments[ 0 ];
//   const command = commands[ commandName ];
//
//   if (!command) {
//     const availableCommands = Object.keys(commands);
//     throw Error(`The command name ${commandName} is not supported, try one of ${JSON.stringify(availableCommands)}`);
//   }
//
//   const commandArguments = arguments.splice(1);
//   command.checkArguments(commandArguments);
//   const result = command.handler(commandArguments);
//
//   process.stdout.write(`Result: ${result}\n`);
// };
//
// // Hiding the text
//
// // Getting the text back
//
// const zeroWidthToBinary = (string) =>
//   string.split('')
//     .map((char) => { // zero-width no-break space
//       if (char === '​') { // zero-width space
//         return '1';
//       } else if (char === '‌') {  // zero-width non-joiner
//         return '0';
//       }
//       return ' '; // add single space
//     })
//     .join('');
//
// const binaryToText = (string) => string.split(' ')
//   .map((num) => String.fromCharCode(parseInt(num, 2)))
//   .join('');
//
// const zeroWidthToText = (text) => binaryToText(zeroWidthToBinary(text));
//
// const checkStringArguments = (arguments, number) => {
//   if (arguments.length !== number) {
//     throw new Error(`Expected ${number} arguments, got ${arguments.length}`);
//   }
//
//   _.each(arguments, (arg) => {
//     if (!arg || typeof arg !== 'string' || arg.length === 0) {
//       throw Error(`The argument ${arg} must be a non-empty string`);
//     }
//   });
// };
//
// const commands = {
//   hide: {
//     checkArguments: (arguments) => checkStringArguments(arguments, 2),
//     handler: (arguments) => {
//       const userName = arguments[ 0 ];
//       const siteName = arguments[ 1 ];
//       const splitUserName = splitAt({ index: 1, text: userName });
//       return `${splitUserName.head}${textToZeroWidth(siteName)}${splitUserName.tail}`;
//     }
//   },
//   show: {
//     checkArguments: (arguments) => checkStringArguments(arguments, 1),
//     handler: (arguments) => zeroWidthToText(arguments[ 0 ])
//   }
// };
//
// main(process.argv.slice(2));
