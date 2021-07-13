import React from "react";
import SignupContainer, { LoginContainer } from '@ui/containers/signup/loginAndEmailScreen';
import { usePageTitle } from '../src/hooks/seo';

function Home() {

	usePageTitle("Login")
	return (
		<div>
			<LoginContainer />
		</div>
	);
}

export default Home;
