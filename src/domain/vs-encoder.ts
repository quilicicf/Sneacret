import { SneacretEncoder } from "./domain.ts";
import { BASE_ALPHABET, NUMBERS, PUNCTUATION_MARKS } from "./alphabet.ts";

const FULL_ALPHABET_LIST: string[] = [
	...NUMBERS,
	...BASE_ALPHABET.map((character) => character.toLowerCase()),
	...BASE_ALPHABET,
	...PUNCTUATION_MARKS,
];

const FULL_ALPHABET_INDEX: Record<string, number> = FULL_ALPHABET_LIST.reduce(
	(seed, character, index) => {
		seed[ character ] = index;
		return seed;
	},
	{} as Record<string, number>,
);

const NUMBER_OF_VARIATION_SELECTORS_IN_FIRST_RANGE: number = 16;
const FIRST_RANGE: number[] = new Array(NUMBER_OF_VARIATION_SELECTORS_IN_FIRST_RANGE)
	.fill("")
	.map((_, i) => 0xFE00 + i);

const NUMBER_OF_VARIATION_SELECTORS_IN_SECOND_RANGE: number = 240;
const SECOND_RANGE: number[] = new Array(NUMBER_OF_VARIATION_SELECTORS_IN_SECOND_RANGE)
	.fill("")
	.map((_, i) => 0xE0100 + i);

const ENCODING_CHARACTERS_LIST: number[] = [ ...FIRST_RANGE, ...SECOND_RANGE ];
const ENCODING_CHARACTERS_INDEX: Record<number, number> = ENCODING_CHARACTERS_LIST
	.reduce(
		(seed, characterCode, index) => {
			seed[ characterCode ] = index;
			return seed;
		},
		{} as Record<number, number>,
	);

const vsEncoder: SneacretEncoder = {
	getAlphabet () {
		return FULL_ALPHABET_LIST;
	},
	encode (container: string, secret: string): string {
		const head = container.slice(0, 1);
		const tail = container.slice(1);

		const encodedSecret = Array.from(secret)
			.map((character) => FULL_ALPHABET_INDEX[ character ])
			.filter((index) => index !== undefined) // Dropping unsupported characters
			.map((index) => ENCODING_CHARACTERS_LIST[ index ])
			.map((characterCode) => String.fromCodePoint(characterCode))
			.reduce((seed, character) => seed + character, "");

		return head + encodedSecret + tail;
	},
	decode (container: string): string {
		return Array.from(container)
			.map((character) => character.codePointAt(0))
			.map((characterCode) => ENCODING_CHARACTERS_INDEX[ characterCode as number ])
			.filter((index) => index !== undefined)
			.map((index) => FULL_ALPHABET_LIST[ index ])
			.join("");
	},
};

export default vsEncoder;
