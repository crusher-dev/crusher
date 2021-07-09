import Head from "next/head";
import { serialize } from "cookie";
import React from "react";
import withoutSession from "@hoc/withoutSession";
import { Button } from "dyson/src/components/atoms/Button";

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
			<Head>
				<title>Login | Crusher</title>
			</Head>

			<Button>sds</Button>
			<div>Test</div>
		</div>
	);
}

Home.getInitialProps = (ctx) => {
	handleClIToken(ctx);
	return {};
};

export default withoutSession(Home);
