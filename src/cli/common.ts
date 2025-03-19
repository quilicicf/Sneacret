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
		coerce: (arg: string) => {
			// FIXME
			// const unsupportedCharacters = arg.split("")
			// 	.filter((character) => !(SUPPORTED_CHARACTERS.includes(character.toUpperCase())));
			//
			// if (unsupportedCharacters.length) {
			// 	throw Error(unsupportedCharacters.length > 1
			// 		? `The characters [ ${ _.join(unsupportedCharacters, ", ") } ] are not supported.`
			// 		: `The character ${ _.join(unsupportedCharacters, ", ") } is not supported.`);
			// }
			return arg;
		},
	},
	[ ArgumentName.TO_CLIPBOARD ]: {
		name: "to-clipboard",
		alias: "t",
		describe: "Copies the result to the clipboard if xclip is installed in the machine",
		type: "boolean",
		default: false,
	},
};
