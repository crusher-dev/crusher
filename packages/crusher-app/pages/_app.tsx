import React from "react";
import { AppProps } from "next/app";
import { useBasicSEO } from '../src/hooks/seo';
import "../src/tailwind.css";

function App({ Component, pageProps }: AppProps<any>) {
	useBasicSEO({favicon: "/assets/img/favicon.png"})
	return (
		<>
			<Component {...pageProps} />
		</>
	);
}

App.getInitialProps = async () => {
	return {
		pageProps: {},
	};
};

export default App;
