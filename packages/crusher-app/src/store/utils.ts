import { atom } from "jotai";
import identity from "lodash/identity";
import pickBy from "lodash/pickBy";

const filterObjectByKeys = (object: Record<string, any>, keys: string[]) => {
    const baseObject: Record<string, any> = {};
    for (const key of keys) {
		baseObject[key] = object[key];
	}
    return baseObject;
};

const updateURL = (object: Record<string, any>) => {
	if (typeof window === "undefined") return;
	const url = new URL(window.location.href);

	const filteredObj = pickBy(object, identity);
	const urlSearchParam = new URLSearchParams(filteredObj);
	url.search = urlSearchParam.toString();
	history.pushState(null, "", url.toString());
};

export const atomWithQuery = (keysToConsider: string[], initialValue: Record<string, any> = {}) => {
	const getBaseValue = () => {
		let baseObject = initialValue;
		const mergeKey = initialValue;

		setTimeout(() => {
			updateURL(filterObjectByKeys(mergeKey, keysToConsider));
		}, 100);

		return baseObject;
	};
	const baseAtom = atom(getBaseValue());

	/*
		Add listener for url change.
	 */

	return atom(
		(get) => get(baseAtom),
		(_get, set, baseObject) => {
			const object = filterObjectByKeys(baseObject, keysToConsider);
			updateURL(object);
			set(baseAtom, object);

			window.addEventListener("popstate", () => {
				const urlSearchObject = Object.fromEntries(new URLSearchParams(location.search));
				const relevant = filterObjectByKeys(urlSearchObject, keysToConsider);
				set(baseAtom, relevant);
			});
		},
	);
};
