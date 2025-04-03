import { Yargs } from "yargs";

import { copy } from "../third-party/clipboard.ts";
import { ArgumentName, ARGUMENTS } from "./common.ts";
import { ENCODERS, EncodingMode } from "../domain/domain.ts";

interface Args {
	[ ArgumentName.MODE ]: EncodingMode,
	[ ArgumentName.CONTAINER ]: string,
	[ ArgumentName.SECRET ]: string,
	[ ArgumentName.TO_CLIPBOARD ]: boolean,
}

const command = 'hide';

function builder (yargs: Yargs): Yargs {
	return yargs
		.usage(`sneacret ${ command } [options]`)
		.option(ArgumentName.MODE, ARGUMENTS[ ArgumentName.MODE ])
		.option(ArgumentName.CONTAINER, ARGUMENTS[ ArgumentName.CONTAINER ])
		.option(ArgumentName.SECRET, ARGUMENTS[ ArgumentName.SECRET ])
		.option(ArgumentName.TO_CLIPBOARD, ARGUMENTS[ ArgumentName.TO_CLIPBOARD ])
		.check((args: Args) => {
			const secret = args[ ArgumentName.SECRET ];
			const mode = args[ ArgumentName.MODE ];
			const encoder = ENCODERS[ mode as EncodingMode ];
			const alphabet = encoder.getAlphabet();
			const invalidCharacters = (Array.from(secret) as string[])
				.filter((character) => !alphabet.includes(character));
			if (invalidCharacters.length) {
				throw Error(`The secret contains characters [${ invalidCharacters.join("") }] which are not part of the allowed characters [${ alphabet.join("") }]`);
			}
			return true;
		})
		.help();
}

async function handler (args: Args): Promise<void> {
	const {
		[ ArgumentName.MODE ]: mode,
		[ ArgumentName.CONTAINER ]: container,
		[ ArgumentName.SECRET ]: secret,
		[ ArgumentName.TO_CLIPBOARD ]: shouldCopyToClipboard,
	} = args;

	const encoder = ENCODERS[ mode as EncodingMode ];
	const result: string = encoder.encode(container, secret);

	console.log(result);
	if (shouldCopyToClipboard) {
		await copy(result);
	}
}

export default {
	command,
	aliases: [ command.charAt(0) ],
	describe: "Hide a string in another string",
	builder,
	handler,
};
