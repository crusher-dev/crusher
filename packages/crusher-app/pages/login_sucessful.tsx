import React from "react";

import { LoginSuccessfulContainer } from "@ui/containers/login_successful";
import { usePageTitle } from "../src/hooks/seo";

function LoginSuccessful() {
	usePageTitle("Login");

	React.useEffect(() => {
		if ((window as any).localStorage.getItem("githubToken") !== null) {
			(window as any).localStorage.removeItem("githubToken");
		}
	}, []);

	return <LoginSuccessfulContainer />;
}

export default LoginSuccessful;
