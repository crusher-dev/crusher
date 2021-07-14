import React from "react";
import { AppProps } from "next/app";
import { SidebarTopBar } from '@ui/layout/DashboardBase';
import { Download } from '@ui/containers/dashboard/Download';

function App({}: AppProps<any>) {
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
