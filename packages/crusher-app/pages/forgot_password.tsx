import React from "react";

import { LoginContainer as ForgotContainer } from "@ui/containers/forgot_password/index";

import { usePageTitle } from "../src/hooks/seo";

function LoginPage() {
	usePageTitle("Forgot Password");

	return (
		<div>
			<ForgotContainer />
		</div>
	);
}

export default LoginPage;
