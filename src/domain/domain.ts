import variationSelectorsEncoder from "./vs-encoder.ts";
import zeroWidthSpacesEncoder from "./zws-encoder.ts";

export enum EncodingMode {
	// See https://medium.com/@umpox/be-careful-what-you-copy-invisibly-inserting-usernames-into-text-with-zero-width-characters-18b4e6f17b66
	ZERO_WIDTH_SPACES = "zws",
	// See https://paulbutler.org/2025/smuggling-arbitrary-data-through-an-emoji/
	VARIATION_SELECTORS = "vs",
}

export interface SneacretEncoder {
	getAlphabet: () => string[],
	encode: (container: string, text: string) => string;
	decode: (container: string) => string;
}

export const ENCODERS: Record<EncodingMode, SneacretEncoder> = {
	[ EncodingMode.VARIATION_SELECTORS ]: variationSelectorsEncoder,
	[ EncodingMode.ZERO_WIDTH_SPACES ]: zeroWidthSpacesEncoder,
};
