import { Arguments } from "yargs/deno-types.ts";
import { YargsInstance } from "yargs/build/lib/yargs-factory.js";

import { FileSystemPath, getBaseName } from "../third-party/file-system.ts";
import { ArgumentName, ARGUMENTS } from "./common.ts";
import { ENCODERS, EncodingMode } from "../domain/domain.ts";

const command = getBaseName(import.meta.filename as FileSystemPath)
	.replace(/\.[^.]+$/, "");

function builder (yargs: YargsInstance): YargsInstance {
	return yargs
		.usage(`sneacret ${ command } [options]`)
		.option(ArgumentName.MODE, ARGUMENTS[ ArgumentName.MODE ])
		.help();
}

function handler (args: Arguments): void {
	const {
		[ ArgumentName.MODE ]: mode,
	} = args;
	const encoder = ENCODERS[ mode as EncodingMode ];
	console.log(`Supported characters: ${ encoder.getAlphabet().join("") }`);
}

export default {
	command,
	aliases: [ command.charAt(0) ],
	describe: "Display the list of supported characters for the secret",
	builder,
	handler,
};
