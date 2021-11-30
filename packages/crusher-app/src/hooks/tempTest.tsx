import { useRouter } from "next/router";
import { useEffect } from "react";

import { useAtom } from "jotai";

import { tempTestAtom } from "../store/atoms/global/tempTestId";
import { tempTestNameAtom } from "../store/atoms/global/tempTestName";

export const useSaveTemp = () => {
	const [, setTempTest] = useAtom(tempTestAtom);
	const [, setTempTestName] = useAtom(tempTestNameAtom);

	const { asPath } = useRouter();

	const queryString = asPath.split("?")?.[1];
	const urlQuery = new URLSearchParams(queryString);
	useEffect(() => {
		if (!urlQuery) return;
		const tempTestId = urlQuery.get("temp_test_id");
		const tempTestName = urlQuery.get("temp_test_name");
		setTempTestName(tempTestName);
		setTempTest(tempTestId);
	}, []);
};
