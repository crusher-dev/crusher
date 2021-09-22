import { ICrusherSDKElement } from "@shared/types/sdk/element";
import { Debugger } from "electron";
import { KeyboardImpl } from "./input/keyboard";
import { MouseImpl } from "./input/mouse";
import * as types from "./types";

class ElementSdk implements ICrusherSDKElement {
	private _pressedModifiers = new Set<types.KeyboardModifier>();

	objectId: string;
	mouseImpl: MouseImpl;
	keyboardImpl: KeyboardImpl;
	cdp: Debugger;

	constructor(objectId: string, mouseImpl: MouseImpl, keyboardImpl: KeyboardImpl, cdp: Debugger) {
		this.objectId = objectId;
		this.mouseImpl = mouseImpl;
		this.keyboardImpl = keyboardImpl;
		this.cdp = cdp;
	}

	click(): Promise<boolean> {
		return this.mouseImpl.click(this.objectId);
	}

	hover(): Promise<boolean> {
		return this.mouseImpl.hover(this.objectId);
	}

	async innerHTML(): Promise<string> {
		const result = await this.cdp.sendCommand("DOM.getInnerHTML", { objectId: this.objectId });
		return "done";
	}

	async evaluate(pageFunc: any, args: any) {
		await this.cdp.sendCommand("Runtime.evaluate", {
			expression: pageFunc,
			objectId: this.objectId,
			arguments: args
		});
	}

	async focus(): Promise<boolean> {
		await this.cdp.sendCommand("DOM.focus", { objectId: this.objectId });
		return true;
	}

	async fill(text: string): Promise<boolean> {
		await this.focus();
		await this.keyboardImpl.sendText(text);
		return true;
	}

	async type(text: string, options: { delay?: number } = {}): Promise<boolean> {
		await this.focus();
		await this.keyboardImpl.type(text, options);
		return true;
	}
}

export { ElementSdk };
