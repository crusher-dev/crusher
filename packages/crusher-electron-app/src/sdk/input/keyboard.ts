import { Debugger } from "electron";
import * as types from "../types";
import { macEditingCommands } from "./macEditingCommands";
import { buildLayoutClosure, isString, KeyDescription, toModifiersMask } from "../utils";
import * as keyboardLayout from "./usKeyboardLayout";

const usKeyboardLayout = buildLayoutClosure(keyboardLayout.USKeyboardLayout);
const kModifiers: types.KeyboardModifier[] = ["Alt", "Control", "Meta", "Shift"];

export class KeyboardImpl {
	_pressedModifiers = new Set<types.KeyboardModifier>();

	constructor(private cdp: Debugger) {}

	_commandsForCode(code: string, modifiers: Set<types.KeyboardModifier>) {
		const parts = [];
		for (const modifier of ["Shift", "Control", "Alt", "Meta"] as types.KeyboardModifier[]) {
			if (modifiers.has(modifier)) parts.push(modifier);
		}
		parts.push(code);
		const shortcut = parts.join("+");
		let commands: any = macEditingCommands[shortcut] || [];
		if (isString(commands)) commands = [commands];
		// Commands that insert text are not supported
		commands = commands.filter((x) => !x.startsWith("insert"));
		// remove the trailing : to match the Chromium command names.
		return commands.map((c) => c.substring(0, c.length - 1));
	}

	async keydown(
		modifiers: Set<types.KeyboardModifier>,
		code: string,
		keyCode: number,
		keyCodeWithoutLocation: number,
		key: string,
		location: number,
		autoRepeat: boolean,
		text: string | undefined,
	): Promise<void> {
		const commands = this._commandsForCode(code, modifiers);
		await this.cdp.sendCommand("Input.dispatchKeyEvent", {
			type: text ? "keyDown" : "rawKeyDown",
			modifiers: toModifiersMask(modifiers),
			windowsVirtualKeyCode: keyCodeWithoutLocation,
			code,
			commands,
			key,
			text,
			unmodifiedText: text,
			autoRepeat,
			location,
			isKeypad: false, // @TODO: Look into this
		});
	}

	async keyup(
		modifiers: Set<types.KeyboardModifier>,
		code: string,
		keyCode: number,
		keyCodeWithoutLocation: number,
		key: string,
		location: number,
	): Promise<void> {
		await this.cdp.sendCommand("Input.dispatchKeyEvent", {
			type: "keyUp",
			modifiers: toModifiersMask(modifiers),
			key,
			windowsVirtualKeyCode: keyCodeWithoutLocation,
			code,
			location,
		});
	}

	async sendText(text: string): Promise<void> {
		await this.cdp.sendCommand("Input.insertText", { text });
	}

	private _keyDescriptionForString(keyString: string): KeyDescription {
		let description = usKeyboardLayout.get(keyString);
		const shift = this._pressedModifiers.has("Shift");
		description = shift && description.shifted ? description.shifted : description;

		// if any modifiers besides shift are pressed, no text should be sent
		if (this._pressedModifiers.size > 1 || (!this._pressedModifiers.has("Shift") && this._pressedModifiers.size === 1)) return { ...description, text: "" };
		return description;
	}

	async press(key: string, options: { delay?: number } = {}) {
		function split(keyString: string) {
			const keys = [];
			let building = "";
			for (const char of keyString) {
				if (char === "+" && building) {
					keys.push(building);
					building = "";
				} else {
					building += char;
				}
			}
			keys.push(building);
			return keys;
		}

		const tokens = split(key);
		const promises = [];
		key = tokens[tokens.length - 1];
		for (let i = 0; i < tokens.length - 1; ++i) promises.push(this.down(tokens[i]));
		promises.push(this.down(key));
		if (options.delay) {
			await Promise.all(promises);
			await new Promise((f) => setTimeout(f, options.delay));
		}
		promises.push(this.up(key));
		for (let i = tokens.length - 2; i >= 0; --i) promises.push(this.up(tokens[i]));
		await Promise.all(promises);
	}

	async down(key: string) {
		const description = this._keyDescriptionForString(key);
		const text = description.text;
		if (kModifiers.includes(description.key as types.KeyboardModifier)) this._pressedModifiers.add(description.key as types.KeyboardModifier);
		await this.keydown(
			this._pressedModifiers,
			description.code,
			description.keyCode,
			description.keyCodeWithoutLocation,
			description.key,
			description.location,
			false,
			text,
		);
	}

	async up(key: string) {
		const description = this._keyDescriptionForString(key);
		if (kModifiers.includes(description.key as types.KeyboardModifier)) this._pressedModifiers.delete(description.key as types.KeyboardModifier);
		await this.keyup(
			this._pressedModifiers,
			description.code,
			description.keyCode,
			description.keyCodeWithoutLocation,
			description.key,
			description.location,
		);
	}

	async type(text: string, options?: { delay?: number }) {
		const delay = (options && options.delay) || undefined;
		for (const char of text) {
			if (usKeyboardLayout.has(char)) {
				await this.press(char, { delay });
			} else {
				if (delay) await new Promise((f) => setTimeout(f, delay));
				await this.sendText(char);
			}
		}
	}
}
