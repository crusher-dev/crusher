import React from "react";
import { AppProps } from "next/app";
import "../src/tailwind.css";

function App({ Component, pageProps }: AppProps<any>) {
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
