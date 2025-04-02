import { Arguments } from "yargs/deno-types.ts";
import { YargsInstance } from "yargs/build/lib/yargs-factory.js";

import { FileSystemPath, getBaseName } from "../third-party/file-system.ts";
import { copy } from "../third-party/clipboard.ts";
import { ArgumentName, ARGUMENTS } from "./common.ts";
import { ENCODERS, EncodingMode } from "../domain/domain.ts";

const command = getBaseName(import.meta.filename as FileSystemPath)
	.replace(/\.[^.]+$/, "");

function builder (yargs: YargsInstance): YargsInstance {
	return yargs
		.usage(`sneacret ${ command } [options]`)
		.option(ArgumentName.MODE, ARGUMENTS[ ArgumentName.MODE ])
		.option(ArgumentName.CONTAINER, ARGUMENTS[ ArgumentName.CONTAINER ])
		.option(ArgumentName.SECRET, ARGUMENTS[ ArgumentName.SECRET ])
		.option(ArgumentName.TO_CLIPBOARD, ARGUMENTS[ ArgumentName.TO_CLIPBOARD ])
		.help();
}

async function handler (args: Arguments): Promise<void> {
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
