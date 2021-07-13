import React from "react";
import { AppProps } from "next/app";
import {SidebarTopBar} from '@ui/layout/DashboardBase';

function App({ Component, pageProps }: AppProps<any>) {
	return (
		<>
		<SidebarTopBar/>


		</>
	);
}

App.getInitialProps = async () => {
	return {
		pageProps: {},
	};
};

export default App;
