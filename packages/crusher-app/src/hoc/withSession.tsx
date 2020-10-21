import { cleanHeaders } from "@utils/backendRequest";
import { getCookies } from "@utils/cookies";
import { redirectToBackendURI, redirectToFrontendPath } from "@utils/router";
import {
	EMAIL_NOT_VERIFIED,
	NO_TEAM_JOINED,
	USER_NOT_REGISTERED,
} from "@utils/constants";
import { getUserInfo, getUserStatus } from "@services/user";

async function handleUserStatus(statusInfo, res, componentScope = null) {
	switch (statusInfo) {
		case EMAIL_NOT_VERIFIED:
			if (componentScope !== EMAIL_NOT_VERIFIED) {
				await redirectToFrontendPath("/verification", res);
			}
			return false;
			break;
		case NO_TEAM_JOINED:
			if (componentScope !== NO_TEAM_JOINED) {
				await redirectToFrontendPath("/onboarding", res);
			}
			return false;
		case USER_NOT_REGISTERED:
			if (componentScope !== USER_NOT_REGISTERED) {
				// console.log(componentScope)
				// await redirectToBackendURI("/user/logout", res);
				return false;
			}
			break;
	}
}

function WithSession(Component, componentScope?: string) {
	const WrappedComponent = function (props) {
		return <Component {...props} />;
	};

	WrappedComponent.getInitialProps = async (ctx) => {
		const { req, res } = ctx;

		const cookies = getCookies(req);
		const isLoggedIn =
			(cookies.isLoggedIn && cookies.isLoggedIn === "true") ||
			(cookies.token && cookies.token.trim() !== "");

		const headers = req ? req.headers : null;

		cleanHeaders(headers);

		// @TODO: Rethink if there is a better way to do this.
		// If req is set, it's server side, otherwise called from client side
		let statusInfo = ctx.userStatus ? ctx.userStatus : null;

		await handleUserStatus(statusInfo, res, componentScope);

		let userInfo = await getUserInfo(headers);

		if (componentScope && componentScope !== statusInfo) {
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
