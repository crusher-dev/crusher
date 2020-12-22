import React, { useEffect } from "react";
import { cleanHeaders } from "@utils/backendRequest";
import { redirectToFrontendPath } from "@utils/router";
import {
	EMAIL_NOT_VERIFIED,
	NO_TEAM_JOINED,
	USER_NOT_REGISTERED,
} from "@utils/constants";
import { getUserInfo } from "@services/user";
import { store } from "@redux/store";
import { saveSelectedProjectInRedux } from "@redux/actions/project";
import { getProjects, getSelectedProject } from "@redux/stateUtils/projects";
import { useSelector } from "react-redux";
import { getCookies } from "@utils/cookies";

async function handleUserStatus(
	statusInfo: any,
	res: any,
	componentScope: string | null = null,
) {
	switch (statusInfo) {
		case EMAIL_NOT_VERIFIED:
			if (componentScope !== EMAIL_NOT_VERIFIED) {
				await redirectToFrontendPath("/verification", res);
				return true;
			}
			return false;
			break;
		case NO_TEAM_JOINED:
			if (componentScope !== NO_TEAM_JOINED) {
				await redirectToFrontendPath("/onboarding", res);
				return true;
			}
			return false;
		case USER_NOT_REGISTERED:
			if (componentScope !== USER_NOT_REGISTERED) {
				return false;
			}
			return true;
			break;
		default:
			return false;
	}
}

function WithSession(Component: any, componentScope?: string) {
	const WrappedComponent = function (props: any) {
		return <Component {...props} />;
	};

	WrappedComponent.getInitialProps = async (ctx: any) => {
		const { req, res, store } = ctx;

		const headers = req ? req.headers : null;

		cleanHeaders(headers);
		// @TODO: Rethink if there is a better way to do this.
		// This is coming from app.tsx.
		const statusInfo = ctx.userStatus || null;
		await handleUserStatus(
			statusInfo,
			res,
			componentScope ? componentScope : null,
		);
		const userInfo = await getUserInfo(headers);

		/*
		If there's invalid project id, set default project id
		 */

		const redirectToDashboard = componentScope && componentScope !== statusInfo;
		if (redirectToDashboard && !userInfo) {
			await redirectToFrontendPath("/", res);
		}

		const pageProps =
			Component.getInitialProps && (await Component.getInitialProps(ctx));
		if (!pageProps) {
			return { status: statusInfo };
		}

		const projectsList = getProjects(store.getState());
		const cookies = getCookies(req);

		let selectedProject = getSelectedProject(store.getState());
		if (!selectedProject) {
			if (cookies.selectedProject) {
				selectedProject = cookies.selectedProject;
			} else {
				selectedProject =
					projectsList && projectsList.length ? projectsList[0].id : null;
			}
		}

		store.dispatch(saveSelectedProjectInRedux(selectedProject));

		return {
			...pageProps,
			status: statusInfo,
			userInfo: userInfo,
			selectedProject,
		};
	};

	return WrappedComponent;
}

export default WithSession;
