import { atom } from "jotai";
import { pickBy, identity } from "lodash";
import { useEffect } from 'react';

const filterObjectByKeys = (object: Record<string, any>, keys: Array<string>) => {
	const baseObject: Record<string, any> = {};
	keys.forEach((key: string) => {
		baseObject[key] = object[key];
	});
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

export const atomWithQuery = (keysToConsider: Array<string>, initialValue: Record<string, any> = {}) => {
	const getBaseValue = () => {
		let baseObject = initialValue;
		const mergeKey = { ...initialValue };

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

			window.addEventListener('popstate',  () => {
					const urlSearchObject = Object.fromEntries(new URLSearchParams(location.search));
					const relevant = filterObjectByKeys(urlSearchObject, keysToConsider);
				  set(baseAtom, relevant);
			});
		},
	);
};
