import { Yargs } from "yargs";

import { FileSystemPath, getBaseName } from "../third-party/file-system.ts";
import { copy } from "../third-party/clipboard.ts";
import { ArgumentName, ARGUMENTS } from "./common.ts";
import { ENCODERS, EncodingMode } from "../domain/domain.ts";

interface Args {
	[ ArgumentName.MODE ]: EncodingMode,
	[ ArgumentName.CONTAINER ]: string,
	[ ArgumentName.SECRET ]: string,
	[ ArgumentName.TO_CLIPBOARD ]: boolean,
}

const command = getBaseName(import.meta.filename as FileSystemPath)
	.replace(/\.[^.]+$/, "");

function builder (yargs: Yargs): Yargs {
	return yargs
		.usage(`sneacret ${ command } [options]`)
		.option(ArgumentName.MODE, ARGUMENTS[ ArgumentName.MODE ])
		.option(ArgumentName.CONTAINER, ARGUMENTS[ ArgumentName.CONTAINER ])
		.option(ArgumentName.SECRET, ARGUMENTS[ ArgumentName.SECRET ])
		.option(ArgumentName.TO_CLIPBOARD, ARGUMENTS[ ArgumentName.TO_CLIPBOARD ])
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
