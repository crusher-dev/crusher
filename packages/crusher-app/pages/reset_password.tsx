import React from "react";

import { SignupContainer as ForgotContainer } from "@ui/containers/reset_password";

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
