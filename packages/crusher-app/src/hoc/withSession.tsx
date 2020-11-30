import React from "react";
import { cleanHeaders } from "@utils/backendRequest";
import { redirectToFrontendPath } from "@utils/router";
import {
	EMAIL_NOT_VERIFIED,
	NO_TEAM_JOINED,
	USER_NOT_REGISTERED,
} from "@utils/constants";
import { getUserInfo } from "@services/user";

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
		const { req, res } = ctx;

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

		return { ...pageProps, status: statusInfo, userInfo: userInfo };
	};

	return WrappedComponent;
}

export default WithSession;
