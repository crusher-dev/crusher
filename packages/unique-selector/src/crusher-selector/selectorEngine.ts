import { isElementMatch } from "./isElementMatch";
import { Cue, Evaluator, Rect } from "./types";

let evaluator: Evaluator;
try {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	evaluator = require("playwright-evaluator");
} catch (e) {
	// this will only error on server side tests that
	// do not require the evaluator but depend on this file
	console.error("Error while loading playwright-evaluator", e);
}

// -- copied from playwright to match their text engine --
function shouldSkipForTextMatching(element: Element | ShadowRoot): boolean {
	return element.nodeName === "SCRIPT" || element.nodeName === "STYLE" || (document.head && document.head.contains(element));
}

export function elementText(root: Element | ShadowRoot): string {
	let value = "";

	if (!shouldSkipForTextMatching(root)) {
		if (root instanceof HTMLInputElement && (root.type === "submit" || root.type === "button")) {
			value = root.value;
		} else {
			for (let child = root.firstChild; child; child = child.nextSibling) {
				if (child.nodeType === Node.ELEMENT_NODE) value += elementText(child as Element);
				else if (child.nodeType === Node.TEXT_NODE) value += child.nodeValue || "";

				// skip long text
				if (value.length > 100) break;
			}
			if ((root as Element).shadowRoot)
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				value += elementText((root as Element).shadowRoot!);
		}
	}

	return value;
}
// --

export const buildSelectorForCues = (cues: Cue[]): string => {
	const levels = [...new Set(cues.map((cue) => cue.level))];

	// sort ascending
	levels.sort((a, b) => a - b);

	const parts: any[] = [];

	let useMultipleEngines = true;

	levels.forEach((level) => {
		const cuesForLevel = cues.filter((cue) => cue.level === level);

		const textCues = cuesForLevel.filter((cue) => cue.type === "text");
		if (textCues.length === 1) {
			parts.push(`text=${textCues[0].value} >> visible=true`);
			useMultipleEngines = true;
			return;
		}

		cuesForLevel.sort((a, b) => {
			// put modifiers last
			if (a.type === "modifier") return 1;
			if (b.type === "modifier") return -1;

			// put tags first
			if (a.type === "tag") return -1;
			if (b.type === "tag") return 1;

			return 0;
		});

		const cssSelector = cuesForLevel.map((cue) => (cue.type === "text" ? `:has-text("${cue.value}")` : cue.value)).join("");
		parts.push(cssSelector);
	});

	return useMultipleEngines ? parts.join(" >> ") : parts.join(" ");
};

export const buildElementText = (element: HTMLElement): string => {
	const text = elementText(element).replace(/\s+/g, " ").trim();
	return text.length > 100 ? "" : text;
};

export const evaluatorQuerySelector = (selector: string, root?: Node): HTMLElement | null => {
	return evaluator.querySelector(selector, root || document);
};

export const evaluatorQuerySelectorAll = (selector: string, root?: Node): Array<HTMLElement> => {
	return evaluator.querySelectorAll(selector, root || document);
};

export const isSelectorMatch = (
	selector: string,
	target: HTMLElement,
	rectCache: Map<HTMLElement, Rect>,
	root: any = null,
): { index: number; selector: string } | null => {
	try {
		const matchedElements = evaluatorQuerySelectorAll(
			selector,
			// We must pass `target.ownerDocument` rather than `document`
			// because sometimes this is called from other frames.
			target.ownerDocument!,
		);

		if (matchedElements.length) {
			if (isElementMatch(matchedElements[0], target, rectCache)) {
				return { index: 1, selector: selector };
			} else {
				let indexCountdown = 1;
				for (const matchedElement of matchedElements) {
					if (isElementMatch(matchedElement, target, rectCache)) {
						return { index: indexCountdown, selector: selector };
					}
					indexCountdown++;
				}
			}
		}

		return null;
	} catch (err) {
		console.error(err);
		return null;
	}
};
