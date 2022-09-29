import { useRouter } from "next/router";
import { useEffect } from "react";

import { useAtom } from "jotai";

import { tempProjectAtom, tempTestAtom } from "../store/atoms/global/temp/tempTestId";
import { tempTestNameAtom } from "../store/atoms/global/temp/tempTestName";
import { tempTestTypeAtom } from "@store/atoms/global/temp/tempTestType";
import { tempTestUpdateIdAtom } from "@store/atoms/global/temp/tempTestUpdateId";
import { githubTokenAtom } from "@store/atoms/global/githubToken";
import { cliLoginUserKeyAtom } from "@store/atoms/global/cliToken";
import { backendRequest } from "@utils/common/backendRequest";
import { resolvePathToBackendURI } from "@utils/common/url";
import { RequestMethod } from "@types/RequestOptions";
import { inviteCodeUserKeyAtom } from "@store/atoms/global/inviteCode";

export const useLoadTempData = () => {
	const [, setTempTest] = useAtom(tempTestAtom);
	const [, setTempTestName] = useAtom(tempTestNameAtom);
	const [, setTempTestType] = useAtom(tempTestTypeAtom);
	const [, setTempTestUpdateId] = useAtom(tempTestUpdateIdAtom);
	const [, setGithubToken] = useAtom(githubTokenAtom);
	const [, setLoginKey] = useAtom(cliLoginUserKeyAtom);
	const [, setProjectToRedirect] = useAtom(tempProjectAtom);
	const [, setInviteCode] = useAtom(inviteCodeUserKeyAtom);

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
		const loginKey = urlQuery.get("lK");
		const inviteCode = urlQuery.get("inviteCode");

		setTempTestName(tempTestName);
		setTempTest(tempTestId);
		setTempTestType(tempTestType || "save");

		if (urlQuery.get("project_id")) {
			setProjectToRedirect(parseInt(urlQuery.get("project_id")));
		};

		if (loginKey) {
			setLoginKey(loginKey);
			backendRequest(resolvePathToBackendURI("/cli/actions/login.user"), { method: RequestMethod.POST, payload: { loginKey } }).catch(() => {
				console.error("Request failed");
			});
		};
		if (inviteCode) {
			setInviteCode(inviteCode);
		};
		if (githubToken) {
			setGithubToken(githubToken);
		}

		if (testId) {
			setTempTestUpdateId(testId);
		};
	}, []);
};
