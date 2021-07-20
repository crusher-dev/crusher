import React, { useEffect, useState } from "react";
import { AppProps } from "next/app";
import { useBasicSEO } from "../src/hooks/seo";
import Head from "next/head";
import "../src/tailwind.css";
import { userSystemAPI } from "@constants/api";
import {  useRouter } from "next/router";
import { LoadingScreen } from "@ui/layout/LoadingScreen";
import { Conditional } from "dyson/src/components/layouts";

import { redirectUserOnMount } from "@utils/routing";

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
