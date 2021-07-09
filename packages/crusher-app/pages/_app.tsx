import React from "react";
import dynamic from "next/dynamic";
import { getMetaFromReq } from "@utils/cookies";
import { NextApiRequest } from "next";
import { getThemeFromCookieOrReq } from "@utils/styleUtils";
import { ToastDialog } from "@ui/atom/toastDialog";
import { AppContext, AppProps } from "next/app";

import "../src/tailwind.css";

const TopProgressBar = dynamic(
	function () {
		return import("@ui/components/app/TopProgressBar");
	},
	{ ssr: false },
);


function App({ Component, pageProps }: AppProps<any>) {
	return (
		<>
			<TopProgressBar />
			<ToastDialog />
			<Component {...pageProps} />
		</>
	);
}

App.getInitialProps = async ({ Component, ctx }: AppContext) => {
	const reqMetaInfo = getMetaFromReq(ctx.req as NextApiRequest);
	(ctx as any).metaInfo = reqMetaInfo;
	const theme = getThemeFromCookieOrReq(ctx, reqMetaInfo);

	const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};

	return {
		pageProps: { ...pageProps, theme },
	};
};

export default App;

