import React from "react";
import { AppContext, AppProps } from "next/app";

import "../src/tailwind.css";



function App({ Component, pageProps }: AppProps<any>) {
	return (
		<>
			<Component {...pageProps} />
		</>
	);
}

App.getInitialProps = async ({ Component, ctx }: AppContext) => {
	
	return {
		pageProps: { },
	};
};

export default App;

