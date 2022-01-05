import React from "react";

import LoginContainer from "@ui/containers/login/opendash";
import { usePageTitle } from "../src/hooks/seo";

function LoginPage() {
	usePageTitle("Login");

	return (
		<div>
			<LoginContainer />
		</div>
	);
}

export default LoginPage;
