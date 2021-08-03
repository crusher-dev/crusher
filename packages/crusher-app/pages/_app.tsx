import React, { useEffect } from "react";
import { AppProps } from "next/app";
import { useAtomDevtools } from "jotai/devtools";
import { useBasicSEO } from "../src/hooks/seo";
import Head from "next/head";
import "../src/tailwind.css";
import { USER_SYSTEM_API } from "@constants/api";
import { LoadingScreen } from "@ui/layout/LoadingScreen";
import { Conditional } from "dyson/src/components/layouts";
import { rootGlobalAtom } from "../src/store/atoms/global/rootAtom";
import { SWRConfig } from "swr";
import { loadUserDataAndRedirect } from "../src/hooks/user";
import { loadUserLeap } from "@utils/scriptUtils";

function App({ Component, pageProps }: AppProps<any>) {
	const [userDataLoaded] = loadUserDataAndRedirect({ fetchData: true, userData: null });
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	useAtomDevtools(rootGlobalAtom);
	useBasicSEO({ favicon: "/assets/img/favicon.png" });

	useEffect(() => {
		loadUserLeap();
	}, []);
	return (
		<>
			<Head>
				<link rel="prefetch" href={USER_SYSTEM_API} as="fetch" />
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<SWRConfig
				value={{
					fetcher: (resource, init) => fetch(resource, { ...init, credentials: "include" }).then((res) => res.json()),
				}}
			>
				<Conditional showIf={!userDataLoaded}>
					<LoadingScreen />
				</Conditional>
				<Conditional showIf={userDataLoaded}>
					<Component {...pageProps} />
				</Conditional>
			</SWRConfig>
		</>
	);
}

export default App;
