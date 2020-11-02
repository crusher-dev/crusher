import React, { useContext, useEffect, useState } from "react";
import { wrapper } from "@redux/store";
import { fetchProjectsFromServer } from "@redux/thunks/projects";
import dynamic from "next/dynamic";
import { getCookies } from "@utils/cookies";
import { emitter } from "@utils/mitt";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { ReactReduxContext } from "react-redux";
import { getUserStatus } from "@services/user";
import { cleanHeaders } from "@utils/backendRequest";
import { USER_NOT_REGISTERED } from "@utils/constants";
import { NextPageContext } from "next";
import { getThemeFromCookie } from "@utils/styleUtils";
import { ThemeContext } from "@constants/style";
import "../src/style/tailwind.css";
import { DialogBox } from "@ui/atom/Dialog";

const TopProgressBar = dynamic(
	function () {
		return import("../src/ui/components/TopProgressBar");
	},
	{ ssr: false },
);

function App({ Component, pageProps }) {
	return (
		<>
			<TopProgressBar />
			<DialogBox />
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

const serverSideStoreResolvers = (
	ctx: NextPageContext,
	headers: any = null,
) => {
	const { store } = ctx;
	return [store.dispatch(fetchProjectsFromServer(headers))];
};

App.getInitialProps = async ({ Component, ctx }: any) => {
	const { req } = ctx;
	let headers;
	if (req) {
		headers = req.headers;
		cleanHeaders(headers);
	}
	const cookies = getCookies(req);
	const isLoggedIn =
		cookies.isLoggedIn === "true" &&
		cookies.token &&
		cookies.token.trim().length > 1;
	const theme = getThemeFromCookie(ctx);

	if (isLoggedIn) {
		const status = await getUserStatus(headers);

		const criticalData = await Promise.all([
			getUserStatus(headers),
			...serverSideStoreResolvers(ctx, headers),
		]);

		if (status === USER_NOT_REGISTERED) {
			return { theme };
		}
		// This can move to redux, would make much more sense to keep data at one place.
		ctx.userStatus = criticalData[0];
	}

	const pageProps = Component.getInitialProps
		? await Component.getInitialProps(ctx)
		: {};

	return {
		pageProps: { ...pageProps, theme },
	};
};

export default wrapper.withRedux(App);
