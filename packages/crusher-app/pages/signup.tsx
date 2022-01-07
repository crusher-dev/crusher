import React from "react";

import SignupContainer from "@ui/containers/auth/signup";
import LearnMoreContainer from "@ui/containers/auth/learn";
import StarContainer from "@ui/containers/auth/opendash";

import { usePageTitle } from "../src/hooks/seo";
import { Conditional } from "dyson/src/components/layouts";

function SignupPage() {
	usePageTitle("Create account");
	const [step, setStep] = React.useState(0);
	const nextStep = React.useCallback(() => {
		setStep((prev) => prev + 1);
	}, []);
	return (
		<React.Fragment>
			<Conditional showIf={step == 0}>
				<SignupContainer nextStepHandler={nextStep} />
			</Conditional>
			<Conditional showIf={step == 1}>
				<LearnMoreContainer nextStepHandler={nextStep} />
			</Conditional>
			<Conditional showIf={step == 2}>
				<StarContainer />
			</Conditional>
		</React.Fragment>
	);
}

export default SignupPage;
