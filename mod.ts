#!/usr/bin/env node

import yargs, {Yargs} from "yargs";

import alphabet from "./src/cli/alphabet.ts";
import hide from "./src/cli/hide.ts";
import show from "./src/cli/show.ts";

async function main () {
	await yargs(Deno.args)
		.usage("Usage: sneacret <command> [options]")
		.command(alphabet)
		.command(hide)
		.command(show)

		.command("groot", "Display a random sentence, in French", () => console.log("Je s'appelle Groot\n"))

		.demandCommand(1, "Specify the command you want to run!")
		.strictCommands()
		.help()
		.version()
		.epilogue("For more information, read the manual at https://github.com/quilicicf/sneacret")
		.wrap(null)
		.parse();
}

main()
	.catch((error) => {
		console.error(`Failed with error: ${ error.stack }\n`);
		Deno.exit(1);
	});
