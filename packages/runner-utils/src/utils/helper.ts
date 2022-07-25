import { iAction } from "@crusher-shared/types/action";
import { iSelectorInfo } from "@crusher-shared/types/selectorInfo";
const validActionTypeRegex = new RegExp(/(PAGE|ELEMENT|BROWSER)\_[A-Z0-1_]*$/);

function uuidv4() {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
		var r = (Math.random() * 16) | 0,
			v = c == "x" ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

const generateScreenshotName = (selector: string, stepIndex: string): string => {
	return selector.replace(/[^\w\s]/gi, "").replace(/ /g, "_") + `_${stepIndex}.png`;
};

const toCrusherSelectorsFormat = (selectors: Array<iSelectorInfo>) => {
	const id = uuidv4();
	const finalSelectors = selectors.filter((selector) => selector.uniquenessScore === 1);
	return { value: `crusher=${encodeURIComponent(JSON.stringify({ selectors: finalSelectors, uuid: id })).replace(/'/g, "%27")}`, uuid: id };
};

const promiseTillSuccess = (promises: Array<Promise<any>>) => {
	return Promise.all(
		promises.map((p) => {
			// If a request fails, count that as a resolution so it will keep
			// waiting for other possible successes. If a request succeeds,
			// treat it as a rejection so Promise.all immediately bails out.
			return p.then(
				(val) => Promise.reject(val),
				(err) => Promise.resolve(err),
			);
		}),
	).then(
		// If '.all' resolved, we've just got an array of errors.
		(errors) => Promise.reject(errors),
		// If '.all' rejected, we've got the result we wanted.
		(val) => Promise.resolve(val),
	);
};

function markTestFail(message: string, meta: any = {}): void {
	const customError = new Error(message);
	(customError as any).meta = meta;

	throw customError;
}

function getBrowserActions(actions: iAction[]) {
	return actions.filter((action: iAction) => {
		const matches = validActionTypeRegex.exec(action.type);
		return action && matches.length && matches[1] === "BROWSER";
	});
}

function getMainActions(actions: iAction[]) {
	return actions.filter((action: iAction) => {
		const matches = validActionTypeRegex.exec(action.type);
		return action && matches[1] !== "BROWSER";
	});
}

function isWebpack() {
	//@ts-ignore
	return typeof __webpack_require__ === "function";
}

function chunkArray(arr, size) {
	const chunkedArr = [];
	let index = 0;
	while (index < arr.length) {
		chunkedArr.push(arr.slice(index, (index += size)));
	}
	return chunkedArr;
}

export {
	uuidv4,
	generateScreenshotName,
	toCrusherSelectorsFormat,
	isWebpack,
	promiseTillSuccess,
	markTestFail,
	getBrowserActions,
	getMainActions,
	validActionTypeRegex,
	chunkArray,
};
