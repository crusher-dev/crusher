import * as types from "./types";
import * as keyboardLayout from "./input/usKeyboardLayout";
import { Protocol } from "playwright/types/protocol";

export type KeyDescription = {
	keyCode: number;
	keyCodeWithoutLocation: number;
	key: string;
	text: string;
	code: string;
	location: number;
	shifted?: KeyDescription;
};

export function isString(obj: any): obj is string {
	return typeof obj === "string" || obj instanceof String;
}

export function toModifiersMask(modifiers: Set<types.KeyboardModifier>): number {
	let mask = 0;
	if (modifiers.has("Alt")) mask |= 1;
	if (modifiers.has("Control")) mask |= 2;
	if (modifiers.has("Meta")) mask |= 4;
	if (modifiers.has("Shift")) mask |= 8;
	return mask;
}

const aliases = new Map<string, string[]>([
	["ShiftLeft", ["Shift"]],
	["ControlLeft", ["Control"]],
	["AltLeft", ["Alt"]],
	["MetaLeft", ["Meta"]],
	["Enter", ["\n", "\r"]],
]);

export function buildLayoutClosure(layout: keyboardLayout.KeyboardLayout): Map<string, KeyDescription> {
	const result = new Map<string, KeyDescription>();
	for (const code in layout) {
		const definition = layout[code];
		const description: KeyDescription = {
			key: definition.key || "",
			keyCode: definition.keyCode || 0,
			keyCodeWithoutLocation: definition.keyCodeWithoutLocation || definition.keyCode || 0,
			code,
			text: definition.text || "",
			location: definition.location || 0,
		};
		if (definition.key.length === 1) description.text = description.key;

		// Generate shifted definition.
		let shiftedDescription: KeyDescription | undefined;
		if (definition.shiftKey) {
			shiftedDescription = { ...description };
			shiftedDescription.key = definition.shiftKey;
			shiftedDescription.text = definition.shiftKey;
			if (definition.shiftKeyCode) shiftedDescription.keyCode = definition.shiftKeyCode;
		}

		// Map from code: Digit3 -> { ... descrption, shifted }
		result.set(code, { ...description, shifted: shiftedDescription });

		// Map from aliases: Shift -> non-shiftable definition
		if (aliases.has(code)) {
			for (const alias of aliases.get(code)!) result.set(alias, description);
		}

		// Do not use numpad when converting keys to codes.
		if (definition.location) continue;

		// Map from key, no shifted
		if (description.key.length === 1) result.set(description.key, description);

		// Map from shiftKey, no shifted
		if (shiftedDescription) result.set(shiftedDescription.key, { ...shiftedDescription, shifted: undefined });
	}
	return result;
}

export function getExceptionMessage(exceptionDetails: Protocol.Runtime.ExceptionDetails): string {
	if (exceptionDetails.exception) return exceptionDetails.exception.description || String(exceptionDetails.exception.value);
	let message = exceptionDetails.text;
	if (exceptionDetails.stackTrace) {
		for (const callframe of exceptionDetails.stackTrace.callFrames) {
			const location = callframe.url + ":" + callframe.lineNumber + ":" + callframe.columnNumber;
			const functionName = callframe.functionName || "<anonymous>";
			message += `\n    at ${functionName} (${location})`;
		}
	}
	return message;
}
