import Head from "next/head";
import { serialize } from "cookie";
import React from "react";
import { Button } from "dyson/src/components/atoms/Button";
import { LoadingView } from "../src/components/LoadingView";
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
			<LoadingView />
		</div>
	);
}

Home.getInitialProps = (ctx) => {
	handleClIToken(ctx);
	return {};
};

export default Home;
