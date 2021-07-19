import React, { useEffect, useState } from "react";
import { AppProps } from "next/app";
import { useBasicSEO } from "../src/hooks/seo";
import Head from "next/head";
import "../src/tailwind.css";
import { USER_SYSTEM_API, userSystemAPI } from "@constants/api";
import { NextRouter, useRouter } from "next/router";
import { backendRequest } from "@utils/backendRequest";
import { LoadingScreen } from "@ui/layout/LoadingScreen";
import { Conditional } from "dyson/src/components/layouts";
import { ROOT_PATH, ROUTES_ACCESSIBLE_WITHOUT_SESSION, ROUTES_TO_REDIRECT_WHEN_SESSION } from "@constants/page";

const redirectUserOnMount = async (router: NextRouter, loadCallback: any) => {
	const data = await backendRequest(USER_SYSTEM_API, {});
	const { userId } = data;
	const { pathname } = router;
	const loggedIn = !!userId;

	if (!loggedIn) {
		if (!ROUTES_ACCESSIBLE_WITHOUT_SESSION.includes(pathname) || pathname === ROOT_PATH) {
			await router.push("/login");
		}
	}
	if (loggedIn) {
		if (ROUTES_TO_REDIRECT_WHEN_SESSION.includes(pathname)) {
			await router.push("/app/dashboard");
		}
	}

	if (loadCallback) {
		loadCallback();
	}
};

function onAppMount() {
	const router = useRouter();
	const [dataLoaded, setDataLoaded] = useState(false);

	useEffect(() => {
		redirectUserOnMount(router, setDataLoaded.bind(this, true));
	}, []);

	return [dataLoaded];
}

function App({ Component, pageProps }: AppProps<any>) {
	const [dataLoaded] = onAppMount();
	useBasicSEO({ favicon: "/assets/img/favicon.png" });
	return (
		<>
			<Head>
				<link rel="prefetch" href={userSystemAPI} as="fetch" />
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<Conditional showIf={!dataLoaded}>
				<LoadingScreen />
			</Conditional>
			<Conditional showIf={dataLoaded}>
				<Component {...pageProps} />
			</Conditional>
		</>
	);
}

export default App;
