import { iSelectorInfo } from "@crusher-shared/types/selectorInfo";

const generateScreenshotName = (selector: string, stepIndex: number): string => {
	return selector.replace(/[^\w\s]/gi, "").replace(/ /g, "_") + `_${stepIndex}.png`;
};

const toCrusherSelectorsFormat = (selectors: Array<iSelectorInfo>) => {
	return `crusher=${encodeURIComponent(JSON.stringify(selectors))}`;
};

const promiseTillSuccess = (promises: Array<Promise<any>>) => {
	return Promise.all(promises.map(p => {
		// If a request fails, count that as a resolution so it will keep
		// waiting for other possible successes. If a request succeeds,
		// treat it as a rejection so Promise.all immediately bails out.
		return p.then(
			val => Promise.reject(val),
			err => Promise.resolve(err)
		);
	})).then(
		// If '.all' resolved, we've just got an array of errors.
		errors => Promise.reject(errors),
		// If '.all' rejected, we've got the result we wanted.
		val => Promise.resolve(val)
	);
}


export { generateScreenshotName, toCrusherSelectorsFormat, promiseTillSuccess };
