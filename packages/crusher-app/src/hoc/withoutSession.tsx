import React from "react";
import { redirectToBackendURI, redirectToFrontendPath } from "@utils/router";
import { getMetaFromReq } from "@utils/cookies";
import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse, NextComponentType, NextPage, NextPageContext } from "next";
import { getUserInfo } from "@redux/stateUtils/user";
import { AnyAction } from "redux";
import { getEdition } from "@utils/helpers";
import { EDITION_TYPE } from '@crusher-shared/types/common/general';

const handleClIToken = (cli_token: string, res: NextApiResponse) => {
	if (cli_token) {
		res.setHeader("Set-Cookie", serialize("cli_token", cli_token, { path: "/", maxAge: 90000 }));
	}
};

function withoutSession(WrappedComponent: NextPage | NextComponentType<NextPageContext<any, AnyAction>, any, any>) {
	const WithoutSession = function (props: any) {
		return <WrappedComponent {...props} />;
	};

	const wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || "Component";

	WithoutSession.displayName = `withoutSession(${wrappedComponentName})`;

	WithoutSession.getInitialProps = async (ctx: NextPageContext) => {
		const { req, res, store, query } = ctx;
		const userInfo = getUserInfo(store.getState());
		const reqMetaInfo = getMetaFromReq(req as NextApiRequest);

		if (query.cli_token) {
			handleClIToken(query.cli_token as string, res as NextApiResponse);
		}
		const {
            isLoggedIn
        } = reqMetaInfo.cookies;

		if (userInfo && isLoggedIn) {
			 await redirectToFrontendPath("/app/project/dashboard", res as NextApiResponse);
			 return
		} else if (getEdition() === EDITION_TYPE.OPEN_SOURCE) {
			 await redirectToBackendURI("/v2/user/init", res as NextApiResponse);
			 return ;
		}

		const pageProps = WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx));

		if (!pageProps) {
			return {};
		}

		return pageProps;
	};

	return WithoutSession;
}

export default withoutSession;
