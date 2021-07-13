import React from "react";
import { AppProps } from "next/app";
import {SidebarTopBar} from '@ui/layout/DashboardBase';
import { Download } from '@ui/containers/dashboard/Download';

function App({ Component, pageProps }: AppProps<any>) {
	return (
		<>
		<SidebarTopBar/>
		<Download/>

		</>
	);
}

App.getInitialProps = async () => {
	return {
		pageProps: {},
	};
};

export default App;
