import React from "react";

import SignupContainer from "@ui/containers/auth/signup_email";

import { usePageTitle } from "../src/hooks/seo";
import { Conditional } from "dyson/src/components/layouts";
import SignupInitial from "@ui/containers/auth/signup";

function SignupPage() {
	usePageTitle("Signup");
	React.useEffect(() => {
		if ((window as any).localStorage.getItem("githubToken") !== null) {
			(window as any).localStorage.removeItem("githubToken");
		}
	}, []);

	const [signupWithEmail, setSignupWithEmail] = React.useState(false);
	return (
		<React.Fragment>
			<Conditional showIf={!signupWithEmail}>
				<SignupInitial loginWithEmailHandler={setSignupWithEmail} />
			</Conditional>
			<Conditional showIf={signupWithEmail}>
				<SignupContainer loginWithEmailHandler={setSignupWithEmail} />
			</Conditional>
		</React.Fragment>
	);
}

export default SignupPage;
