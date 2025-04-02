import { SneacretEncoder } from "./domain.ts";
import { BASE_ALPHABET, NUMBERS, PUNCTUATION_MARKS } from "./alphabet.ts";

const FULL_ALPHABET_LIST: string[] = [ ...NUMBERS, ...BASE_ALPHABET, ...PUNCTUATION_MARKS ];

const FULL_ALPHABET_INDEX: Record<string, number> = FULL_ALPHABET_LIST.reduce(
	(seed, character, index) => {
		seed[ character ] = index;
		return seed;
	},
	{} as Record<string, number>,
);
/**
 * Characters found on https://en.wikipedia.org/wiki/Whitespace_character (second table)
 */

// Removed because it shows up in git logs: MONGOLIAN_VOWEL_SEPARATOR: String.fromCharCode(0x180E)
export const SPACES_MAP: Record<string, string> = {
	ZERO_WIDTH_SPACE: String.fromCharCode(0x200B),
	ZERO_WIDTH_NON_JOINER: String.fromCharCode(0x200C),
	ZERO_WIDTH_JOINER: String.fromCharCode(0x200D),
	WORD_JOINER: String.fromCharCode(0x2060),
	ZERO_WIDTH_NO_BREAK_SPACE: String.fromCharCode(0xFEFF),
};

export const SPACES: string[] = Object.values(SPACES_MAP);

export const ENCODING_BASE: number = SPACES.length;

export const ENCODED_CHARACTER_SIZE: number = new Array(8)
	.fill("")
	.map((_value, index) => index)
	.find((indexBaseZero) => Math.pow(ENCODING_BASE, indexBaseZero) >= BASE_ALPHABET.length) as number;

interface ChunkAccumulator {
	chunk: string;
	chunks: string[];
}

const zwsEncoder: SneacretEncoder = {
	getAlphabet (): string[] {
		return FULL_ALPHABET_LIST;
	},
	encode (container: string, secret: string): string {
		const head = container.slice(0, 1);
		const tail = container.slice(1);

		const encodedSecret = secret.split("")
			.map((character) => character.toUpperCase())
			.map((upperCaseCharacter) => FULL_ALPHABET_INDEX[ upperCaseCharacter ].toString(ENCODING_BASE))
			.map((characterCode) => characterCode.padStart(ENCODED_CHARACTER_SIZE, "0"))
			.map((baseN) => (
				baseN.split("")
					.map((digit) => SPACES[ parseInt(digit, 10) ])
					.join("")),
			)
			.join("");

		return head + encodedSecret + tail;
	},
	decode (container: string): string {
		return container.split("")
			.filter((character) => SPACES.includes(character))
			.map((space) => SPACES.indexOf(space))
			.reduce(
				(seed, character, index) => {
					if (index % ENCODED_CHARACTER_SIZE === ENCODED_CHARACTER_SIZE - 1) {
						seed.chunks.push(`${ seed.chunk }${ character }`);
						seed.chunk = "";
					} else {
						seed.chunk += character;
					}
					return seed;
				},
				{ chunk: "", chunks: [] } as ChunkAccumulator,
			)
			.chunks
			.map((baseN: string) => parseInt(baseN, ENCODING_BASE))
			.map((baseTenNumber: number) => FULL_ALPHABET_LIST[ baseTenNumber ])
			.join("");
	},
};

export default zwsEncoder;
