import { ElementHandle } from "playwright";

export default async function type(elHandle: ElementHandle, keyCodes: Array<string>) {
	for (let i = 0; i < keyCodes.length; i++) {
		await elHandle.press(keyCodes[i]);
	}
	return true;
}
