import { atom } from "jotai";
import { useRouter } from "next/router";

export const atomWithQuery = (atomName, value) => {
	const router = useRouter();
	const { pathname, href } = router;
	return atom(
		(get) => get(atomName),
		(_get, set, query) => {
			const urlParam = new URLSearchParams(value);
			urlParam.toString();

			router.push({
				pathname,
				href,
				query,
			});

			set(atomName, query);
		},
	);
};

