import { useRouter } from "next/router";
import { useEffect } from "react";

import { useAtom } from "jotai";

import { tempTestAtom } from "../store/atoms/global/tempTestId";
import { tempTestNameAtom } from "../store/atoms/global/tempTestName";
import { tempTestTypeAtom } from "@store/atoms/global/tempTestType";
import { tempTestUpdateIdAtom } from "@store/atoms/global/tempTestUpdateId";

export const useSaveTemp = () => {
	const [, setTempTest] = useAtom(tempTestAtom);
	const [, setTempTestName] = useAtom(tempTestNameAtom);
	const [, setTempTestType] = useAtom(tempTestTypeAtom);
	const [, setTempTestUpdateId] = useAtom(tempTestUpdateIdAtom);

	const { asPath } = useRouter();

	const queryString = asPath.split("?")?.[1];
	const urlQuery = new URLSearchParams(queryString);
	useEffect(() => {
		if (!urlQuery) return;
		const tempTestId = urlQuery.get("temp_test_id");
		const tempTestName = urlQuery.get("temp_test_name");
		const tempTestType = urlQuery.get("temp_test_type");
		const testId = urlQuery.get("update_test_id");

		console.log(`Temp Test ID: ${tempTestId}`);
		console.log(`Temp Test Name: ${tempTestName}`);
		console.log(`Temp Test Type: ${tempTestType}`);
		console.log(`Update Test ID: ${testId}`);

		setTempTestName(tempTestName);
		setTempTest(tempTestId);
		setTempTestType(tempTestType || "save");
		if(!!testId) {
			setTempTestUpdateId(testId);
		}
	}, []);
};
