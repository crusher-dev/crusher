import React from "react";

import { usePageTitle } from '../src/hooks/seo';
import { LoginContainer } from "@ui/containers/login/loginAndEmailScreen";

function LoginPage() {
	usePageTitle("Login");

	return (
		<div>
			<LoginContainer/>
		</div>
	);
}

export default LoginPage;
