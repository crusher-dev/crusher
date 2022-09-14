import { AppProps } from "next/app";
import Head from "next/head";
import React, { useEffect } from "react";

import { useAtomDevtools } from "jotai/devtools";
import { SWRConfig } from "swr";

import { Conditional } from "dyson/src/components/layouts";

import { Snackbar } from "@ui/containers/common/Snackbar";
import { LoadingScreen } from "@ui/layout/LoadingScreen";
import { loadGTM, loadCrisp, loadGA, loadSegment, loadUserLeap } from "@utils/common/scriptUtils";

import { useBasicSEO } from "/src/hooks/seo";
import { usePageSegmentAnalytics } from "/src/hooks/analytics";
import { useLoadTempData } from "/src/hooks/tempTest";
import { loadUserDataAndRedirect } from "/src/hooks/user";
import { rootGlobalAtom } from "/src/store/atoms/global/rootAtom";
import "/src/tailwind.css";

function App({ Component, pageProps }: AppProps<any>) {
	useLoadTempData();

	const [userDataLoaded] = loadUserDataAndRedirect({ fetchData: true, userAndSystemData: null });
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	useAtomDevtools(rootGlobalAtom);
	useBasicSEO({ favicon: "/assets/img/favicon.png" });

	usePageSegmentAnalytics();
	useEffect(() => {
		setTimeout(() => {
			loadGA();
			loadSegment();
			loadGTM();
		}, 4000);
	}, []);
	return (
		<>
			<Head>
				<meta name="referrer" content="origin" />
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
				<style id="fonts">{fontCSS}</style>
				{preload}
				
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

const preload = (
	<React.Fragment>
			<link rel="preload" as="font" href="/assets/fonts/CeraPro/Cera_Pro_Black.woff2"/>
	<link rel="preload" as="font" href="/assets/fonts/CeraPro/Cera_Pro_Bold.woff2"/>
    <link rel="preload" as="font" href="/assets/fonts/Gilroy/Gilroy-Regular.woff2"/>
	<link rel="preload" as="font" href="/assets/fonts/Gilroy/Gilroy-Medium.woff2"/>
	<link rel="preload" as="font" href="/assets/fonts/Gilroy/Gilroy-SemiBold.woff2"/>
	<link rel="preload" as="font" href="/assets/fonts/Gilroy/Gilroy-Bold.woff2"/>
	<link rel="preload" as="font" href="/assets/fonts/Gilroy/Gilroy-ExtraBold.woff2"/>
		</React.Fragment>
)

const fontCSS = `
@font-face {
	font-family: "Cera Pro";
	src: url("/assets/fonts/CeraPro/Cera_Pro_Thin.woff2") format("woff2");
	font-weight: 200;
	font-style: normal;
}

@font-face {
	font-family: "Cera Pro";
	src: url("/assets/fonts/CeraPro/Cera_Pro_Thin_Italic.woff2") format("woff2");
	font-weight: 200;
	font-style: italic;
}

@font-face {
	font-family: "Cera Pro";
	src: url("/assets/fonts/CeraPro/Cera_Pro_Light.woff2") format("woff2");
	font-weight: 300;
	font-style: normal;
}

@font-face {
	font-family: "Cera Pro";
	src: url("/assets/fonts/CeraPro/Cera_Pro_Light_Italic.woff2") format("woff2");
	font-weight: 300;
	font-style: italic;
}

@font-face {
	font-family: "Cera Pro";
	src: url("/assets/fonts/CeraPro/Cera_Pro_Regular.woff2") format("woff2");
	font-weight: 400;
	font-style: normal;
}

@font-face {
	font-family: "Cera Pro";
	src: url("/assets/fonts/CeraPro/Cera_Pro_Regular_Italic.woff2") format("woff2");
	font-weight: 400;
	font-style: italic;
}

@font-face {
	font-family: "Cera Pro";
	src: url("/assets/fonts/CeraPro/Cera_Pro_Medium.woff2") format("woff2");
	font-weight: 500;
	font-style: normal;
}

@font-face {
	font-family: "Cera Pro";
	src: url("/assets/fonts/CeraPro/Cera_Pro_Medium_Italic.woff2") format("woff2");
	font-weight: 500;
	font-style: italic;
}

@font-face {
	font-family: "Cera Pro";
	src: url("/assets/fonts/CeraPro/Cera_Pro_Bold.woff2") format("woff2");
	font-weight: 700;
	font-style: normal;
}

@font-face {
	font-family: "Cera Pro";
	src: url("/assets/fonts/CeraPro/Cera_Pro_Bold_Italic.woff2") format("woff2");
	font-weight: 700;
	font-style: italic;
}

@font-face {
	font-family: "Cera Pro";
	src: url("/assets/fonts/CeraPro/Cera_Pro_Black.woff2") format("woff2");
	font-weight: 900;
	font-style: normal;
}

@font-face {
	font-family: "Cera Pro";
	src: url("/assets/fonts/CeraPro/Cera_Pro_Black_Italic.woff2") format("woff2");
	font-weight: 900;
	font-style: italic;
}

@font-face {
	font-family: "Gilroy";
	src: url("/assets/fonts/Gilroy/Gilroy-Regular.woff2") format("woff2");
	font-weight: 400;
	font-style: normal;
}

@font-face {
	font-family: "Gilroy";
	src: url("/assets/fonts/Gilroy/Gilroy-RegularItalic.woff2") format("woff2");
	font-weight: 400;
	font-style: italic;
}

@font-face {
	font-family: "Gilroy";
	src: url("/assets/fonts/Gilroy/Gilroy-Medium.woff2") format("woff2");
	font-weight: 500;
	font-style: normal;
}

@font-face {
	font-family: "Gilroy";
	src: url("/assets/fonts/Gilroy/Gilroy-MediumItalic.woff2") format("woff2");
	font-weight: 500;
	font-style: italic;
}

@font-face {
	font-family: "Gilroy";
	src: url("/assets/fonts/Gilroy/Gilroy-SemiBold.woff2") format("woff2");
	font-weight: 600;
	font-style: normal;
}

@font-face {
	font-family: "Gilroy";
	src: url("/assets/fonts/Gilroy/Gilroy-SemiBoldItalic.woff2") format("woff2");
	font-weight: 600;
	font-style: italic;
}

@font-face {
	font-family: "Gilroy";
	src: url("/assets/fonts/Gilroy/Gilroy-Bold.woff2") format("woff2");
	font-weight: 700;
	font-style: normal;
}

@font-face {
	font-family: "Gilroy";
	src: url("/assets/fonts/Gilroy/Gilroy-ExtraBold.woff2") format("woff2");
	font-weight: 800;
	font-style: normal;
}

@font-face {
	font-family: "Gilroy";
	src: url("/assets/fonts/Gilroy/Gilroy-Black.woff2") format("woff2");
	font-weight: 900;
	font-style: normal;
}

`;

export default App;
