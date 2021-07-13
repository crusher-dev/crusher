import React from "react";
import SignupContainer from "@ui/containers/signup/loginAndEmailScreen";
import { usePageTitle } from '../src/hooks/seo';

function Home() {
	usePageTitle("Create account")
	return (
		<div>
			<SignupContainer />
		</div>
	);
}

export default Home;
