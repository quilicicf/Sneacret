import {Yargs} from 'yargs';

import { copy } from "../third-party/clipboard.ts";
import { ArgumentName, ARGUMENTS } from "./common.ts";
import { ENCODERS, EncodingMode } from "../domain/domain.ts";

const command = 'show';

interface Args {
	[ ArgumentName.MODE ]: EncodingMode,
	[ ArgumentName.CONTAINER ]: string,
	[ ArgumentName.TO_CLIPBOARD ]: boolean,
}

function builder (yargs: Yargs): Yargs {
	return yargs
		.usage(`sneacret ${ command } [options]`)
		.option(ArgumentName.MODE, ARGUMENTS[ ArgumentName.MODE ])
		.option(ArgumentName.CONTAINER, ARGUMENTS[ ArgumentName.CONTAINER ])
		.option(ArgumentName.TO_CLIPBOARD, ARGUMENTS[ ArgumentName.TO_CLIPBOARD ])
		.help();
}

async function handler (args: Args): Promise<void> {
	const {
		[ ArgumentName.MODE ]: mode,
		[ ArgumentName.CONTAINER ]: container,
		[ ArgumentName.TO_CLIPBOARD ]: shouldCopyToClipboard,
	} = args;

	const encoder = ENCODERS[ mode as EncodingMode ];
	const secret = encoder.decode(container);

	console.log(secret);
	if (shouldCopyToClipboard) {
		await copy(secret);
	}
}

export default {
	command,
	aliases: [ command.charAt(0) ],
	describe: "Show the dirty secrets hidden inside a string",
	builder,
	handler,
};
