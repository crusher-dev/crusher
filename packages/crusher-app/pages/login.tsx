import React from "react";
import LoginContainer from "@ui/containers/auth/login";
import { usePageTitle } from "../src/hooks/seo";

function LoginPage() {
	usePageTitle("Login");

	React.useEffect(() => {
		if ((window as any).localStorage.getItem("githubToken") !== null) {
			(window as any).localStorage.removeItem("githubToken");
		}
	}, []);

	return <LoginContainer />;
}

export default LoginPage;
