import { Locator } from "playwright";

export async function type(elHandle: Locator, keyCodes: Array<string>) {
	for (let i = 0; i < keyCodes.length; i++) {
		await elHandle.first().press(keyCodes[i]);
	}
	return true;
}
