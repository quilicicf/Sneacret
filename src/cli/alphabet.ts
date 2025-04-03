import { Yargs } from "yargs";

import { ArgumentName, ARGUMENTS } from "./common.ts";
import { ENCODERS, EncodingMode } from "../domain/domain.ts";

interface Args {
	[ ArgumentName.MODE ]: EncodingMode,
}

const command = 'alphabet';

function builder (yargs: Yargs): Yargs {
	return yargs
		.usage(`sneacret ${ command } [options]`)
		.option(ArgumentName.MODE, ARGUMENTS[ ArgumentName.MODE ])
		.help();
}

function handler (args: Args): void {
	const {
		[ ArgumentName.MODE ]: mode,
	} = args;
	const encoder = ENCODERS[ mode as EncodingMode ];
	console.log(`Supported characters for mode ${mode}: ${ encoder.getAlphabet().join("") }`);
}

export default {
	command,
	aliases: [ command.charAt(0) ],
	describe: "Display the list of supported characters for the secret",
	builder,
	handler,
};
