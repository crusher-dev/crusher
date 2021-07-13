import { serialize } from "cookie";
import React from "react";
import { LoadingScreen } from "../src/ui/layout/LoadingScreen";
const handleClIToken = (ctx) => {
	const {
		query: { cli_token },
		res,
	} = ctx;
	if (cli_token) {
		res.setHeader("Set-Cookie", serialize("cli_token", cli_token, { path: "/", maxAge: 90000 }));
	}
};

function Home() {
	return (
		<div>
			<LoadingScreen />
		</div>
	);
}

Home.getInitialProps = (ctx) => {
	handleClIToken(ctx);
	return {};
};

export default Home;
