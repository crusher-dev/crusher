import React from "react";
import { serialize } from "cookie";
import { NextApiResponse, NextComponentType, NextPage, NextPageContext } from "next";
import { AnyAction } from "redux";

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
		const pageProps = WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx));

		if (!pageProps) {
			return {};
		}

		return { ...pageProps };
	};

	return WithoutSession;
}

export default withoutSession;
