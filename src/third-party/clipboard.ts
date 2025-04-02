import ChildProcess = Deno.ChildProcess;

enum SupportedOs {
	DARWIN = "darwin",
	LINUX = "linux",
	WINDOWS = "windows",
}

interface ClipboardCommand {
	name: string;
	args: string[];
}

const COPY_COMMANDS: Record<SupportedOs, ClipboardCommand> = {
	[ SupportedOs.DARWIN ]: { name: "pbcopy", args: [] },
	[ SupportedOs.LINUX ]: { name: "wl-copy", args: [] },
	[ SupportedOs.WINDOWS ]: { name: "powershell", args: [ "-Command", "Set-Clipboard" ] },
};

const OS = Deno.build.os;

export async function copy (text: string): Promise<void> {
	const clipboardCommand: ClipboardCommand = COPY_COMMANDS[ OS as SupportedOs ];

	if (!clipboardCommand) {
		throw Error(`Copy to clipboard not supported for OS ${ OS }, PR welcome.`);
	}

	const childProcess: ChildProcess = await new Deno.Command(clipboardCommand.name, {
		args: clipboardCommand.args,
		stdin: "piped",
	}).spawn();

	const stdinWriter = childProcess.stdin.getWriter();
	await stdinWriter.write(new TextEncoder().encode(text));
	await stdinWriter.close();

	await childProcess.output();
}
