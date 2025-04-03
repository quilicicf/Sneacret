import { EncodingMode } from "../domain/domain.ts";

export enum ArgumentName {
	MODE = "mode",
	CONTAINER = "container",
	SECRET = "secret",
	TO_CLIPBOARD = "to-clipboard",
}

export const ARGUMENTS: Record<ArgumentName, object> = {
	[ ArgumentName.MODE ]: {
		name: "mode",
		alias: "m",
		describe: "The encoding mode",
		type: "string",
		choices: Object.values(EncodingMode),
		default: EncodingMode.VARIATION_SELECTORS,
	},
	[ ArgumentName.CONTAINER ]: {
		name: "container",
		alias: "c",
		describe: "The string in which to hide a dirty secret",
		type: "string",
	},
	[ ArgumentName.SECRET ]: {
		name: "secret",
		alias: "s",
		describe: "The dirty secret to hide",
		type: "string",
	},
	[ ArgumentName.TO_CLIPBOARD ]: {
		name: "to-clipboard",
		alias: "t",
		describe: "Copies the result to the clipboard if xclip is installed in the machine",
		type: "boolean",
		default: false,
	},
};
