import React from "react";

import LoginContainer from "@ui/containers/auth/login";
import LoginWithEmailContainer from "@ui/containers/auth/email";
import { usePageTitle } from "../src/hooks/seo";

function LoginPage() {
	usePageTitle("Login");
	const [isLoginWithEmail, setLoginWithEmail] = React.useState(false)
	if (isLoginWithEmail) {
		return <LoginWithEmailContainer goBackHandler={() => setLoginWithEmail(false)} />
	}
	else {
		return <LoginContainer loginWithEmailHandler={() => setLoginWithEmail(true)} />
	}
}

export default LoginPage;
