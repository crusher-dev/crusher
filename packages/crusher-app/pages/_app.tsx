import { AppProps } from "next/app";
import Head from "next/head";
import React, { useEffect } from "react";

import { useAtomDevtools } from "jotai/devtools";
import { SWRConfig } from "swr";

import { Conditional } from "dyson/src/components/layouts";

import { Snackbar } from "@ui/containers/common/Snackbar";
import { LoadingScreen } from "@ui/layout/LoadingScreen";
import { loadCrisp, loadGA, loadSegment, loadUserLeap } from '@utils/common/scriptUtils';

import { useBasicSEO } from "../src/hooks/seo";
import {usePageSegmentAnalytics} from "../src/hooks/analytics";
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
	usePageSegmentAnalytics()
	useEffect(() => {
		setTimeout(() => {

			loadGA();
			loadSegment()
		}, 4000);

		setTimeout(()=>{
			loadUserLeap();
			loadCrisp();
		},8000)
	}, []);
	return (
		<>
			<Head>
				<meta name="referrer" content="origin" />
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<SWRConfig
				value={{
					fetcher: (resource, init) =>
						fetch(resource, { ...init, credentials: "include", headers: { ...(init && init.headers ? init.headers : {}) } }).then((res) => res.json()),
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
