import React from "react";
import { css, jsx } from "@emotion/core";
import { BlankBase, CenterLayout, Conditional } from "dyson/src/components/layouts";
import { useState } from "react";
import CrusherBase from "../src/components/CrusherBase";
import { Button, GithubSocialBtn } from "dyson/src/components/atoms";

const HowItWorksView = () => {
	return (
		<>
			<div className="m-8 text-16">How it works in 60 seconds?</div>
			<div
				className="rounded-10"
				css={css`
					background-color: #191e22;
					height:400px;
					width:544px;
					overflow:hidden;
				`}
			>
				<video width="100%" controls>
					<source src="https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4" type="video/mp4" />
					Your browser does not support HTML video.
				</video>
			</div>

		</>
	);
};

const OpenDashView = () => {
	return (
		<>
			<div className="m-8 text-17 text-center">{`"We help devs ship HQ fast. We do this by eliminating
     chores and removing noise from their workflow."`}</div>
			{/* github button */}
			<div className="my-4 text-16 flex flex-col">
				Start us to show some love
				{/* replace with dyson github */}
				<div className="m-20">
					<GithubSocialBtn count={234} />
				</div>
			</div>
			<div className="my-4 text-16 flex flex-col">
				Join us and ship products with other devs
				{/* replace it with dyson discord */}
				<button>Discord</button>
			</div>
		</>
	);
};

const getViewByStep = (step: number) => {
	switch (step) {
		case 0:
			return <HowItWorksView />;
		case 1:
			return <OpenDashView />;
		default:
			return null;
	}
};

const BeforeDashboard = () => {
	const [step, setStep] = useState(0);
	const handleNext = () => {
		setStep(step + 1);
	};
	return (
		<CrusherBase>
			<CenterLayout>
				<div className="flex flex-col items-center" css={containerCSS}>
					{getViewByStep(step)}
					<Conditional showIf={step < 1}>
						<Button children="Next" className="my-12" onClick={handleNext} />
					</Conditional>
					<Conditional showIf={step === 1}>
						<Button children="Open Dashboard" className="my-32" />
					</Conditional>
				</div>
			</CenterLayout>
		</CrusherBase>
	);
};

const containerCSS = css`
  max-width:473rem;
`

export default BeforeDashboard;
