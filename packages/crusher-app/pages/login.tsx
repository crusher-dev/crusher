import React from "react";

import LoginContainer from "@ui/containers/auth/login";
import LoginWithEmailContainer from "@ui/containers/auth/login_email";
import { usePageTitle } from "../src/hooks/seo";

function LoginPage() {
	usePageTitle("Login");

	React.useEffect(() => {
		if ((window as any).localStorage.getItem("githubToken") !== null) {
			(window as any).localStorage.removeItem("githubToken");
		}
	}, []);

	return <LoginContainer loginWithEmailHandler={() => {}} />;
}

export default LoginPage;
