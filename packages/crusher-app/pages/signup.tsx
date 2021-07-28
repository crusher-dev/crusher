import React from "react";
import SignupContainer from "@ui/containers/signup/signupScreen";
import { usePageTitle } from "../src/hooks/seo";

function SignupPage() {
	usePageTitle("Create account");

	return (
		<div>
			<SignupContainer />
		</div>
	);
}

export default SignupPage;
