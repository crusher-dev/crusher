import React from "react";

import Container from "@ui/containers/auth/forget";

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
