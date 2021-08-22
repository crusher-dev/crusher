import { AppProps } from "next/app";
import Head from "next/head";
import React, { useEffect } from "react";

import { useAtomDevtools } from "jotai/devtools";
import { SWRConfig } from "swr";

import { Conditional } from "dyson/src/components/layouts";

import { USER_SYSTEM_API } from "@constants/api";
import { Snackbar } from "@ui/containers/common/Snackbar";
import { LoadingScreen } from "@ui/layout/LoadingScreen";
import { loadCrisp, loadUserLeap } from "@utils/scriptUtils";

import { useBasicSEO } from "../src/hooks/seo";
import { useSaveTemp } from "../src/hooks/tempTest";
import { loadUserDataAndRedirect } from "../src/hooks/user";
import { rootGlobalAtom } from "../src/store/atoms/global/rootAtom";
import "../src/tailwind.css";

function App({ Component, pageProps }: AppProps<any>) {
	const [userDataLoaded] = loadUserDataAndRedirect({ fetchData: true, userAndSystemData: null });
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	useAtomDevtools(rootGlobalAtom);
	useBasicSEO({ favicon: "/assets/img/favicon.png" });
	useSaveTemp();
	useEffect(() => {
		loadUserLeap();
		setTimeout(() => {
			loadCrisp();
		}, 6000);
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

				<Snackbar />
			</SWRConfig>
		</>
	);
}

export default App;
