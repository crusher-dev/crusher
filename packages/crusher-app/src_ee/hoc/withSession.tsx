import React from "react";
import { redirectToFrontendPath } from "@utils/router";
import { EMAIL_NOT_VERIFIED, NO_TEAM_JOINED, SIGNED_IN, USER_NOT_REGISTERED } from "@utils/constants";
import { saveSelectedProjectInRedux } from "@redux/actions/currentProject";
import { getProjects, getSelectedProject } from "@redux/stateUtils/projects";
import { iUserInfoResponse } from "@crusher-shared/types/response/userInfoResponse";
import { getUserInfo } from "@redux/stateUtils/user";
import { NextApiResponse } from "next";

function getUserStatus(userInfo: iUserInfoResponse | null) {
	if (!userInfo || userInfo === null) {
		return USER_NOT_REGISTERED;
	} else if (userInfo.team_id === null) {
		return NO_TEAM_JOINED;
	} else if (!userInfo.verified) {
		return EMAIL_NOT_VERIFIED;
	} else {
		return SIGNED_IN;
	}
}

function redirectIfNotThisScope(userStatus: any, componentScope: any, res: NextApiResponse) {
	if (userStatus === EMAIL_NOT_VERIFIED && componentScope !== userStatus) {
		return null;
	} else if (userStatus === NO_TEAM_JOINED && componentScope !== userStatus) {
		return redirectToFrontendPath("/setup", res);
	} else if (userStatus === USER_NOT_REGISTERED && componentScope !== userStatus) {
		return redirectToFrontendPath("/", res);
	}

	return null;
}

async function handleUserStatus(userInfo: iUserInfoResponse, res: any, componentScope: string | null = null) {
	const userStatus = getUserStatus(userInfo);

	return [redirectIfNotThisScope(userStatus, componentScope, res), userStatus];
}

function withSession(WrappedComponent: any, componentScope?: string) {
	const WithSession = function (props: any) {
		return <WrappedComponent {...props} />;
	};

	const wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || "Component";

	WithSession.displayName = `withSession(${wrappedComponentName})`;

	WithSession.getInitialProps = async (ctx: any) => {
		const { res, store, metaInfo } = ctx as any;

		const userInfo = getUserInfo(store.getState());

		const [redirectResponse, userStatus] = await handleUserStatus(userInfo, res, componentScope ? componentScope : null);

		if (!redirectResponse) {
			const pageProps = WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx));

			if (!pageProps) {
				return { status: userStatus };
			}
			const projectsList = getProjects(store.getState());
			const cookies = metaInfo.cookies;

			let selectedProject = getSelectedProject(store.getState());
			if (!selectedProject) {
				if (cookies.selectedProject) {
					selectedProject = cookies.selectedProject;
				} else {
					selectedProject = projectsList && projectsList.length ? projectsList[0].id : null;
				}
			}

			store.dispatch(saveSelectedProjectInRedux(selectedProject));

			return {
				...pageProps,
				status: userStatus,
				userInfo: userInfo,
				selectedProject,
			};
		}

		await redirectResponse;
	};

	return WithSession;
}

export default withSession;
