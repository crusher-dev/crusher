import React from "react";

import { Container } from "@ui/containers/forgot_password/index";

import { usePageTitle } from "../src/hooks/seo";

function LoginPage() {
	usePageTitle("Forgot Password");

	return (
		<div>
			<Container />
		</div>
	);
}

export default LoginPage;
