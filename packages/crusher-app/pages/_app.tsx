import React, { useState } from "react";
import { wrapper } from "@redux/store";
import { fetchProjectsFromServer } from "@redux/thunks/projects";
import "nprogress/nprogress.css";
import dynamic from "next/dynamic";
import { getCookies } from "@utils/cookies";
import { css } from "@emotion/core";
import { emitter } from "@utils/mitt";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { ReactReduxContext } from "react-redux";
import { getUserStatus } from "@services/user";
import { cleanHeaders } from "@utils/backendRequest";
import { USER_REGISTERED } from "@utils/constants";
import { NextPageContext } from "next";

const TopProgressBar = dynamic(
	function () {
		return import("../src/components/TopProgressBar");
	},
	{ ssr: false },
);

function ErrorBox() {
	const [error, setError] = useState(null);

	emitter.on("error", function (error) {
		setError(error);
	});

	if (!error) {
		return null;
	}

	return <div css={styles.errorBox}></div>;
}

function CrusherApp({ Component, pageProps }) {
	return (
		<>
			<TopProgressBar />
			<ErrorBox />
			<ReactReduxContext.Consumer>
				{({ store }) => (
					<Provider store={store}>
						<PersistGate loading={null} persistor={(store as any).__persistor}>
							<Component {...pageProps} />
						</PersistGate>
					</Provider>
				)}
			</ReactReduxContext.Consumer>
			<style jsx global>{`
				body {
					background: #202029;
					font-family: DM Sans;
				}
				::-webkit-scrollbar {
					width: 2px; /* Remove scrollbar space */
				}
				a {
					text-decoration: none;
					color: inherit;
					cursor: pointer;
				}
				a:hover {
					text-decoration: none;
					color: unset !important;
				}
			`}</style>
		</>
	);
}

const serverSideStoreResolvers = (
	ctx: NextPageContext,
	headers: any = null,
) => {
	const { req, store } = ctx;

	return [store.dispatch(fetchProjectsFromServer(headers))];
};

CrusherApp.getInitialProps = async ({ Component, ctx }: any) => {
	const { req, res } = ctx;
	let headers;
	if (req) {
		headers = req.headers;
		cleanHeaders(headers);
	}
	const cookies = getCookies(req);
	const isLoggedIn =
		(cookies.isLoggedIn && cookies.isLoggedIn === "true") ||
		(cookies.token && cookies.token.trim() !== "");

	if (isLoggedIn) {
		const status = await getUserStatus(headers);
		ctx.userStatus = status;
		if (status === USER_REGISTERED) {
			await Promise.all(serverSideStoreResolvers(ctx, headers));
		}
	}

	return {
		pageProps: Component.getInitialProps
			? await Component.getInitialProps(ctx)
			: {},
	};
};

const styles = {
	errorBox: css`
		position: absolute;
	`,
};

export default wrapper.withRedux(CrusherApp);
