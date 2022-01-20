import { useRouter } from "next/router";
import { useEffect } from "react";

import { useAtom } from "jotai";

import { tempTestAtom } from "../store/atoms/global/tempTestId";
import { tempTestNameAtom } from "../store/atoms/global/tempTestName";
import { tempTestTypeAtom } from "@store/atoms/global/tempTestType";
import { tempTestUpdateIdAtom } from "@store/atoms/global/tempTestUpdateId";
import { githubTokenAtom } from "@store/atoms/global/githubToken";

export const useSaveTemp = () => {
	const [, setTempTest] = useAtom(tempTestAtom);
	const [, setTempTestName] = useAtom(tempTestNameAtom);
	const [, setTempTestType] = useAtom(tempTestTypeAtom);
	const [, setTempTestUpdateId] = useAtom(tempTestUpdateIdAtom);
	const [, setGithubToken] = useAtom(githubTokenAtom);

	const { asPath } = useRouter();

	const queryString = asPath.split("?")?.[1];
	const urlQuery = new URLSearchParams(queryString);
	useEffect(() => {
		if (!urlQuery) return;
		const tempTestId = urlQuery.get("temp_test_id");
		const tempTestName = urlQuery.get("temp_test_name");
		const tempTestType = urlQuery.get("temp_test_type");
		const testId = urlQuery.get("update_test_id");

		const githubToken = urlQuery.get("github_token");

		setTempTestName(tempTestName);
		setTempTest(tempTestId);
		setTempTestType(tempTestType || "save");

		if(githubToken) {
			setGithubToken(githubToken);
		}

		if (!!testId) {
			setTempTestUpdateId(testId);
		}
	}, []);
};
