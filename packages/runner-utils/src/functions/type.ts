import { ElementHandle } from "playwright";

export default async function type(
	elHandle: ElementHandle,
	keyCodes: Array<number>,
) {
	for (let i = 0; i < keyCodes.length; i++) {
		await elHandle.press(String.fromCharCode(keyCodes[i]));
	}
	return true;
}
