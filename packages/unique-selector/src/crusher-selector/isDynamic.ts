// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import htmlTags from "html-tags";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const englishWords = require("an-array-of-english-words/index.json");

const SPLIT_REGEXP = /[ \-_:]+/;

const allWords = new Set([
	"btn",
	"checkbox",
	"dropdown",
	// favicon
	"fa",
	"grid",
	"inputtext",
	"lg",
	"login",
	"logout",
	// medium
	"md",
	// material ui
	"mui",
	"nav",
	"signin",
	"signout",
	"signup",
	"sm",
	"textinput",
	"todo",
	// credit card inputs
	"cvc",
	// companies
	"paypal",
	...htmlTags,
	...englishWords,
]);

// remove the alphabet from word list
for (let i = 0; i < 26; i++) allWords.delete((i + 10).toString(36));

function splitCamelCaseWithAbbreviations(text: string) {
	return text.split(/([A-Z][a-z]+)/).filter((val: string) => val.length);
}

export const getTokens = (value: string): string[] => {
	const tokens: any[] = [];

	// split by space, dash, underscore, colon
	for (const token of value.split(SPLIT_REGEXP)) {
		if (token.match(/\d/)) {
			tokens.push(token);
		} else {
			// split by camel case when there are no numbers
			tokens.push(...splitCamelCaseWithAbbreviations(token));
		}
	}

	return tokens.map((token) => token.toLowerCase());
};

export const isDynamicEpoch = (value: number) => {
	const dateValue = new Date(value);
	const currentDate = new Date();
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	//@ts-ignore
	const diffTime = Math.abs(currentDate - dateValue);

	if (diffTime < 3600000) return true;
	return false;
};

/**
 * @summary Given an attribute value, breaks it apart into pieces/words, and
 *   then determines how many pieces are dynamically generated.
 * @param {String} value The attribute value to check
 * @return {Boolean} If two or more pieces are dynamic, or if 1 out of 2 pieces
 *   or 1 out of 1 piece are dynamic, returns true. Also returns `true` if
 *   `value` is not a string.
 */
export const isDynamic = (value: string): boolean => {
	if (!value || typeof value !== "string") return true;

	// ignore styled components classes
	if (value.startsWith("Styled")) return true;
	const tokens = getTokens(value);

	// For react `select-input`, using date-time

	let words = 0;
	let numbers = 0;
	let penalty = 0;

	for (const token of tokens) {
		if (allWords.has(token)) {
			++words;
		} else if (!isNaN(Number(token))) {
			if (!isDynamicEpoch(Number(token))) {
				++numbers;
			} else {
				penalty += 2;
			}
		} else if (/\d/.test(token)) {
			// mark letter and number combinations as dynamic, ex 123v9c3
			return true;
		}
	}

	// If known tokens are not more than half the tokens, consider it dynamic
	return (words + numbers) / (tokens.length + penalty) <= 0.5;
};
