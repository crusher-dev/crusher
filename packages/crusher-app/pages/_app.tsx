import React from "react";
import { wrapper } from "@redux/store";
import { fetchProjectsFromServer } from "@redux/thunks/projects";
import dynamic from "next/dynamic";
import { getMetaFromReq, isUserLoggedInFromCookies } from "@utils/cookies";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { ReactReduxContext } from "react-redux";
import { _fetchUserInfo } from "@services/user";
import { NextApiRequest } from "next";
import { getThemeFromCookieOrReq } from "@utils/styleUtils";
import { ThemeContext } from "@constants/style";
import { ToastDialog } from "@ui/atom/toastDialog";
import { AppContext, AppProps } from "next/app";
import { setUserLoggedIn } from "@redux/actions/user";
import { saveProjectsInRedux } from "@redux/actions/project";

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
			<ReactReduxContext.Consumer>
				{({ store }) => (
					<Provider store={store}>
						<PersistGate loading={null} persistor={(store as any).__persistor}>
							<ThemeContext.Provider value={pageProps.theme}>
								<Component {...pageProps} />
							</ThemeContext.Provider>
						</PersistGate>
					</Provider>
				)}
			</ReactReduxContext.Consumer>
		</>
	);
}

App.getInitialProps = async ({ Component, ctx }: AppContext) => {
	const { store } = ctx;
	const reqMetaInfo = getMetaFromReq(ctx.req as NextApiRequest);
	(ctx as any).metaInfo = reqMetaInfo;

	const { cookies, headers } = reqMetaInfo;

	const loggedInCookies = isUserLoggedInFromCookies(cookies);
	const theme = getThemeFromCookieOrReq(ctx, reqMetaInfo);

	if (loggedInCookies) {
		await Promise.all([_fetchUserInfo(headers), fetchProjectsFromServer(headers)])
			.then((userData) => {
				const userInfo = userData[0];
				const projects = userData[1];

				store.dispatch(setUserLoggedIn(userInfo));
				store.dispatch(saveProjectsInRedux(projects));
			})
			.catch((ex) => {
				console.debug("Some issue occurred", ex);
			});
	}

	const pageProps = Component.getInitialProps
		? await Component.getInitialProps(ctx)
		: {};

	return {
		pageProps: { ...pageProps, theme },
	};
};

export default wrapper.withRedux(App);
