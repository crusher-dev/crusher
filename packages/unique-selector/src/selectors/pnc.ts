// @ts-nocheck
import { SelectorData } from '../interfaces/result';
import { SELECTOR_TYPE } from '../../../../../unique-selector/src/constants';
import _ from 'lodash';

let rootDocument;
export const getPnC = (htmlNode: HTMLElement, target: HTMLElement): SelectorData[] => {
	rootDocument = target;
	let time = Date.now();
	console.log(0);
	const seed2Selectors = generateNDepthSelector(htmlNode, target, 2, 2);
	const newTime = Date.now();
	console.log(newTime - time);
	time = newTime;
	const seed3Selectors = generateNDepthSelector(htmlNode, target, 3, 3);
	const newTime = Date.now();
	console.log(newTime - time);
	time = newTime;
	const seed4Selectors = generateNDepthSelector(htmlNode, target, 4, 4);
	const newTime = Date.now();
	console.log(newTime - time);
	time = newTime;
	const seed5Selectors = generateNDepthSelector(htmlNode, target, 5, 5);
	console.log(newTime - time);
	time = newTime;
	const seed6Selectors = generateNDepthSelector(htmlNode, target, 6, 6);
	console.log(newTime - time);
	time = newTime;
	const seed7Selectors = generateNDepthSelector(htmlNode, target, 7, 7);
	console.log(newTime - time);
	time = newTime;
	const seed8Selectors = generateNDepthSelector(htmlNode, target, 8, 8);
	console.log(newTime - time);
	time = newTime;

	const result = [...seed2Selectors, ...seed3Selectors, ...seed4Selectors, ...seed5Selectors, ...seed6Selectors, ...seed7Selectors, ...seed8Selectors];

	return _.uniqBy(result, 'value');
};

const generateNDepthSelector = (htmlNode: HTMLElement, target: HTMLElement, seed: number = 5, optimized: number = 5) => {
	let optimizationLevel = 2;
	const output = [];

	while (optimizationLevel <= 2) {
		const configuration = {
			root: target,
			seedMinLength: seed,
			optimizedMinLength: optimizationLevel,
			threshold: 500,
			maxNumberOfTries: 1000,
		};

		const querySelector = finder(htmlNode, configuration);
		if (!querySelector) break;
		const resultObject = {
			type: SELECTOR_TYPE.PNC,
			value: querySelector,
			uniquenessScore: 1,
			meta: {
				seedLength: seed,
				optimized: optimizationLevel++,
			},
		};
		output.push(resultObject);
	}
	return output;
};

// Source code based off https://github.com/antonmedv/finder/blob/master/finder.ts

type Node = {
	name: string;
	penalty: number;
	level?: number;
};

type Path = Node[];

enum Limit {
	All,
	Two,
	One,
}

export type Options = {
	root: Element;
	idName: (name: string) => boolean;
	className: (name: string) => boolean;
	tagName: (name: string) => boolean;
	attr: (name: string, value: string) => boolean;
	seedMinLength: number;
	optimizedMinLength: number;
	threshold: number;
	maxNumberOfTries: number;
};

let config: Options;

export function finder(input: Element, options?: Partial<Options>) {
	if (input.nodeType !== Node.ELEMENT_NODE) {
		throw new Error(`Can't generate CSS selector for non-element node type.`);
	}

	if ('html' === input.tagName.toLowerCase()) {
		return 'html';
	}

	const defaults: Options = {
		root: document.body,
		idName: (name: string) => true,
		className: (name: string) => true,
		tagName: (name: string) => true,
		attr: (name: string, value: string) => false,
		seedMinLength: 1,
		optimizedMinLength: 2,
		threshold: 1000,
		maxNumberOfTries: 10000,
	};

	config = { ...defaults, ...options };

	let path = bottomUpSearch(input, Limit.All, () => bottomUpSearch(input, Limit.Two, () => bottomUpSearch(input, Limit.One)));

	if (path) {
		const optimized = sort(optimize(path, input));

		if (optimized.length > 0) {
			path = optimized[0];
		}

		return selector(path);
	} else {
		return null;
	}
}

function findRootDocument(rootNode: Element | Document, defaults: Options) {
	if (rootNode.nodeType === Node.DOCUMENT_NODE) {
		return rootNode;
	}
	if (rootNode === defaults.root) {
		return rootNode.ownerDocument as Document;
	}
	return rootNode;
}

function bottomUpSearch(input: Element, limit: Limit, fallback?: () => Path | null): Path | null {
	let path: Path | null = null;
	let stack: Node[][] = [];
	let current: Element | null = input;
	let i = 0;

	while (current && current !== config.root.parentElement) {
		let level: Node[] = maybe(id(current)) || maybe(...attr(current)) || maybe(...classNames(current)) || maybe(tagName(current)) || [any()];

		const nth = index(current);

		if (limit === Limit.All) {
			if (nth) {
				level = level.concat(level.filter(dispensableNth).map((node) => nthChild(node, nth)));
			}
		} else if (limit === Limit.Two) {
			level = level.slice(0, 1);

			if (nth) {
				level = level.concat(level.filter(dispensableNth).map((node) => nthChild(node, nth)));
			}
		} else if (limit === Limit.One) {
			const [node] = (level = level.slice(0, 1));

			if (nth && dispensableNth(node)) {
				level = [nthChild(node, nth)];
			}
		}

		for (let node of level) {
			node.level = i;
		}

		stack.push(level);

		if (stack.length >= config.seedMinLength) {
			path = findUniquePath(stack, fallback);
			if (path) {
				break;
			}
		}

		current = current.parentElement;
		i++;
	}

	if (!path) {
		path = findUniquePath(stack, fallback);
	}

	return path;
}

function findUniquePath(stack: Node[][], fallback?: () => Path | null): Path | null {
	const paths = sort(combinations(stack));

	if (paths.length > config.threshold) {
		return fallback ? fallback() : null;
	}

	for (let candidate of paths) {
		if (unique(candidate)) {
			return candidate;
		}
	}

	return null;
}

function selector(path: Path): string {
	let node = path[0];
	let query = node.name;
	for (let i = 1; i < path.length; i++) {
		const level = path[i].level || 0;

		if (node.level === level - 1) {
			query = `${path[i].name} > ${query}`;
		} else {
			query = `${path[i].name} ${query}`;
		}

		node = path[i];
	}
	return query;
}

function penalty(path: Path): number {
	return path.map((node) => node.penalty).reduce((acc, i) => acc + i, 0);
}

function unique(path: Path) {
	try {
		switch (rootDocument.querySelectorAll(selector(path)).length) {
			case 0:
				throw new Error(`Can't select any node with this selector: ${selector(path)}`);
			case 1:
				return true;
			default:
				return false;
		}
	} catch (err) {
		return false;
	}
}

function id(input: Element): Node | null {
	const elementId = input.getAttribute('id');
	if (elementId && config.idName(elementId)) {
		return {
			name: '#' + cssesc(elementId, { isIdentifier: true }),
			penalty: 0,
		};
	}
	return null;
}

function attr(input: Element): Node[] {
	const attrs = Array.from(input.attributes).filter((attr) => config.attr(attr.name, attr.value));

	return attrs.map(
		(attr): Node => ({
			name: '[' + cssesc(attr.name, { isIdentifier: true }) + '="' + cssesc(attr.value) + '"]',
			penalty: 0.5,
		}),
	);
}

function classNames(input: Element): Node[] {
	const names = Array.from(input.classList).filter(config.className);

	return names.map(
		(name): Node => ({
			name: '.' + cssesc(name, { isIdentifier: true }),
			penalty: 1,
		}),
	);
}

function tagName(input: Element): Node | null {
	const name = input.tagName.toLowerCase();
	if (config.tagName(name)) {
		return {
			name,
			penalty: 2,
		};
	}
	return null;
}

function any(): Node {
	return {
		name: '*',
		penalty: 3,
	};
}

function index(input: Element): number | null {
	const parent = input.parentNode;
	if (!parent) {
		return null;
	}

	let child = parent.firstChild;
	if (!child) {
		return null;
	}

	let i = 0;
	while (child) {
		if (child.nodeType === Node.ELEMENT_NODE) {
			i++;
		}

		if (child === input) {
			break;
		}

		child = child.nextSibling;
	}

	return i;
}

function nthChild(node: Node, i: number): Node {
	return {
		name: node.name + `:nth-child(${i})`,
		penalty: node.penalty + 1,
	};
}

function dispensableNth(node: Node) {
	return node.name !== 'html' && !node.name.startsWith('#');
}

function maybe(...level: (Node | null)[]): Node[] | null {
	const list = level.filter(notEmpty);
	if (list.length > 0) {
		return list;
	}
	return null;
}

function notEmpty<T>(value: T | null | undefined): value is T {
	return value !== null && value !== undefined;
}

function* combinations(stack: Node[][], path: Node[] = []): Generator<Node[]> {
	if (stack.length > 0) {
		for (let node of stack[0]) {
			yield* combinations(stack.slice(1, stack.length), path.concat(node));
		}
	} else {
		yield path;
	}
}

function sort(paths: Iterable<Path>): Path[] {
	return Array.from(paths).sort((a, b) => penalty(a) - penalty(b));
}

type Scope = {
	counter: number;
	visited: Map<string, boolean>;
};

function* optimize(
	path: Path,
	input: Element,
	scope: Scope = {
		counter: 0,
		visited: new Map<string, boolean>(),
	},
): Generator<Node[]> {
	if (path.length > 2 && path.length > config.optimizedMinLength) {
		for (let i = 1; i < path.length - 1; i++) {
			if (scope.counter > config.maxNumberOfTries) {
				return; // Okay At least I tried!
			}
			scope.counter += 1;
			const newPath = [...path];
			newPath.splice(i, 1);
			const newPathKey = selector(newPath);
			if (scope.visited.has(newPathKey)) {
				return;
			}
			if (unique(newPath) && same(newPath, input)) {
				yield newPath;
				scope.visited.set(newPathKey, true);
				yield* optimize(newPath, input, scope);
			}
		}
	}
}

function same(path: Path, input: Element) {
	return rootDocument.querySelector(selector(path)) === input;
}

const regexAnySingleEscape = /[ -,\.\/:-@\[-\^`\{-~]/;
const regexSingleEscape = /[ -,\.\/:-@\[\]\^`\{-~]/;
const regexExcessiveSpaces = /(^|\\+)?(\\[A-F0-9]{1,6})\x20(?![a-fA-F0-9\x20])/g;

const defaultOptions = {
	escapeEverything: false,
	isIdentifier: false,
	quotes: 'single',
	wrap: false,
};

// tslint:disable-next-line:variable-name
function cssesc(string: string, opt: Partial<typeof defaultOptions> = {}) {
	const options = { ...defaultOptions, ...opt };
	if (options.quotes !== 'single' && options.quotes !== 'double') {
		options.quotes = 'single';
	}
	const quote = options.quotes === 'double' ? '"' : "'";
	const isIdentifier = options.isIdentifier;

	const firstChar = string.charAt(0);
	let output = '';
	let counter = 0;
	const length = string.length;
	while (counter < length) {
		const character = string.charAt(counter++);
		let codePoint = character.charCodeAt(0);
		let value: string | undefined = void 0;
		// If it’s not a printable ASCII character…
		if (codePoint < 0x20 || codePoint > 0x7e) {
			if (codePoint >= 0xd800 && codePoint <= 0xdbff && counter < length) {
				// It’s a high surrogate, and there is a next character.
				const extra = string.charCodeAt(counter++);
				if ((extra & 0xfc00) === 0xdc00) {
					// next character is low surrogate
					codePoint = ((codePoint & 0x3ff) << 10) + (extra & 0x3ff) + 0x10000;
				} else {
					// It’s an unmatched surrogate; only append this code unit, in case
					// the next code unit is the high surrogate of a surrogate pair.
					counter--;
				}
			}
			value = '\\' + codePoint.toString(16).toUpperCase() + ' ';
		} else {
			if (options.escapeEverything) {
				if (regexAnySingleEscape.test(character)) {
					value = '\\' + character;
				} else {
					value = '\\' + codePoint.toString(16).toUpperCase() + ' ';
				}
			} else if (/[\t\n\f\r\x0B]/.test(character)) {
				value = '\\' + codePoint.toString(16).toUpperCase() + ' ';
			} else if (
				character === '\\' ||
				(!isIdentifier && ((character === '"' && quote === character) || (character === "'" && quote === character))) ||
				(isIdentifier && regexSingleEscape.test(character))
			) {
				value = '\\' + character;
			} else {
				value = character;
			}
		}
		output += value;
	}

	if (isIdentifier) {
		if (/^-[-\d]/.test(output)) {
			output = '\\-' + output.slice(1);
		} else if (/\d/.test(firstChar)) {
			output = '\\3' + firstChar + ' ' + output.slice(1);
		}
	}

	// Remove spaces after `\HEX` escapes that are not followed by a hex digit,
	// since they’re redundant. Note that this is only possible if the escape
	// sequence isn’t preceded by an odd number of backslashes.
	output = output.replace(regexExcessiveSpaces, function ($0, $1, $2) {
		if ($1 && $1.length % 2) {
			// It’s not safe to remove the space, so don’t.
			return $0;
		}
		// Strip the space.
		return ($1 || '') + $2;
	});

	if (!isIdentifier && options.wrap) {
		return quote + output + quote;
	}
	return output;
}
